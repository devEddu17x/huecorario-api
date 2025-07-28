import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
} from '@nestjs/common';
import { CreateStudentDTO } from 'src/student/dtos/create-student.dto';
import { AuthService } from './services/auth.service';
import { VerifyEmailDTO } from './dtos/verify-email.dto';
import { Student } from 'src/student/schemas/student.schema';
import { mapResendError } from 'src/mail/helper/error-mapper.helper';
import { AuthLoginDTO } from './dtos/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() createStudentDTO: CreateStudentDTO): Promise<any> {
    const { data, error } = await this.authService.register(createStudentDTO);
    if (error) {
      throw new BadRequestException(mapResendError(error.name));
    }
    return {
      message: 'A verification email has been sent to your email address.',
    };
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDTO: VerifyEmailDTO): Promise<Student> {
    try {
      return await this.authService.verifyEmail(verifyEmailDTO);
    } catch (error) {
      throw new BadRequestException('Invalid verification code or email.');
    }
  }

  @HttpCode(200)
  @Post('login')
  async login(
    @Body() loginDTO: AuthLoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(loginDTO, res);
  }
}
