import { Controller, Get, Req } from '@nestjs/common';
import { CustomRequest } from 'src/auth/interfaces/custom-request.interface';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  @Get('me')
  getProfile(@Req() req: CustomRequest) {
    return this.studentService.findById(req.user._id);
  }
}
