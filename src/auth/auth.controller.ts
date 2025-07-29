import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateStudentDTO } from 'src/student/dtos/create-student.dto';
import { AuthService } from './services/auth.service';
import { VerifyEmailDTO } from './dtos/verify-email.dto';
import { Student } from 'src/student/schemas/student.schema';
import { mapResendError } from 'src/mail/helper/error-mapper.helper';
import { AuthLoginDTO } from './dtos/login.dto';
import { Request, Response } from 'express';
import { NoAccesTokenNeeded } from 'src/common/decorators/is-public.decorator';
import { CustomRequest } from './interfaces/custom-request.interface';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @NoAccesTokenNeeded()
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
  @NoAccesTokenNeeded()
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDTO: VerifyEmailDTO): Promise<Student> {
    try {
      return await this.authService.verifyEmail(verifyEmailDTO);
    } catch (error) {
      throw new BadRequestException('Invalid verification code or email.');
    }
  }
  @NoAccesTokenNeeded()
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() loginDTO: AuthLoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(loginDTO, res);
  }

  @NoAccesTokenNeeded()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: CustomRequest,
  ) {
    return await this.authService.refreshTokens(req, res);
  }
}
