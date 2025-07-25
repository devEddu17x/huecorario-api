import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateStudentDTO } from 'src/student/dtos/create-student.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() createStudentDTO: CreateStudentDTO): Promise<any> {
    const { data, error } = await this.authService.register(createStudentDTO);
    if (error) {
      throw new BadRequestException(error.message);
    }
    return {
      message: 'A verification email has been sent to your email address.',
    };
  }
}
