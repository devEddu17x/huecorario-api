import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { CreateStudentDTO } from 'src/student/dtos/create-student.dto';
import { StudentService } from 'src/student/student.service';
import { generateCode } from '../helpers/code-generator.helper';
import { CacheService } from 'src/cache/cache.service';
import { CreateEmailResponse } from 'nestjs-resend';
import { renderTemplate } from 'src/mail/mail.template';
import { Template } from 'src/common/enums/template.enum';
import { EmailTakenError } from 'src/common/errors/email-taken.error';
import { ResendService } from 'src/mail/resend.service';
import { VerifyEmailDTO } from '../dtos/verify-email.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Student, StudentDocument } from 'src/student/schemas/student.schema';
import { AuthLoginDTO } from '../dtos/login.dto';
import { Payload } from '../interfaces/payload.interface';
import { TokenService } from './token.service';
import { Request, Response } from 'express';
import { Token } from '../enums/tokens-name.enum';
import { Environment } from 'src/common/enums/environment.enum';
import { parseTimeString } from 'src/common/utils/parseTimeString';
import { CustomRequest } from '../interfaces/custom-request.interface';

@Injectable()
export class AuthService {
  private readonly rounds: number;
  constructor(
    private readonly studentService: StudentService,
    private readonly mailService: ResendService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {
    this.rounds = this.configService.get<number>('bcrypt.rounds');
    if (!this.rounds) {
      throw new Error('Bcrypt rounds not configured');
    }
  }
  async register(
    createStudentDTO: CreateStudentDTO,
  ): Promise<CreateEmailResponse> {
    const isAvailable: boolean = await this.studentService.emailIsAvailable(
      createStudentDTO.email,
    );

    if (!isAvailable) {
      throw new EmailTakenError(createStudentDTO.email);
    }
    const verificationCode: number = generateCode();
    const codeKey: string = `code:${createStudentDTO.email}`;
    const studentKey: string = `student:${createStudentDTO.email}`;
    await Promise.all([
      await this.cacheService.setData<number>(codeKey, verificationCode, 600), // 10 minutes
      await this.cacheService.setData<CreateStudentDTO>(
        studentKey,
        createStudentDTO,
        600, // 10 minutes
      ),
    ]);
    const template = await renderTemplate(Template.EMAIL_CONFIRMATION, {
      code: verificationCode,
    });
    const response: CreateEmailResponse = await this.mailService.sendEmail(
      createStudentDTO.email,
      'Verify your email',
      template,
    );
    return response;
  }

  async verifyEmail(verifyEmailDTO: VerifyEmailDTO): Promise<Student> {
    const { email, verificationCode } = verifyEmailDTO;
    const codeKey = `code:${email}`;
    const cachedCode = await this.cacheService.getData<number>(codeKey);

    if (!cachedCode) {
      throw new Error('Verification code expired or invalid');
    }

    if (cachedCode !== verificationCode) {
      throw new Error('Invalid verification code');
    }

    const studentKey: string = `student:${email}`;
    const studentData: CreateStudentDTO =
      await this.cacheService.getData<CreateStudentDTO>(studentKey);
    if (!studentData) {
      throw new Error('Student data not found');
    }

    studentData.password = await bcrypt.hash(studentData.password, this.rounds);

    return await this.studentService.create(studentData);
  }

  async login(
    loginDTO: AuthLoginDTO,
    res: Response,
  ): Promise<{ student: StudentDocument; tokenExpiresIn: string }> {
    const { email, password } = loginDTO;

    const student: StudentDocument = await this.studentService.validateStudent(
      email,
      password,
    );
    if (!student) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload: Payload = {
      sub: student._id.toString(),
      email: student.email,
    };
    await this.setTokensInCookies(payload, res);
    return {
      student,
      tokenExpiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
    };
  }

  async refreshTokens(req: CustomRequest, res: Response) {
    try {
      const tokenFromRequest = req.token;
      const tokenFromCache = await this.cacheService.getData<string>(
        `${Token.REFRESH_TOKEN}:${req.user.email}`,
      );
      if (tokenFromCache !== tokenFromRequest) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const payload: Payload = { sub: req.user._id, email: req.user.email };
      await this.setTokensInCookies(payload, res);
      return {
        tokenExpiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to refresh tokens');
    }
  }

  private async setTokensInCookies(payload: Payload, res: Response) {
    const { accessToken, refreshToken } =
      await this.tokenService.generatePairTokens(payload);

    const environment = this.configService.get<string>('app.environment');

    res.cookie(Token.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: environment == Environment.PRODUCTION,
      sameSite: environment == Environment.PRODUCTION ? 'none' : 'lax',
      maxAge: parseTimeString(
        this.configService.get<string>('jwt.accessExpiresIn'),
      ),
      path: '/api',
    });

    res.cookie(Token.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: environment == Environment.PRODUCTION,
      sameSite: environment == Environment.PRODUCTION ? 'none' : 'lax',
      maxAge: parseTimeString(
        this.configService.get<string>('jwt.refreshExpiresIn'),
      ),
      path: '/api/auth/refresh',
    });
  }
}
