import {Body, Controller, HttpException, Post} from '@nestjs/common';
import {error} from 'console';
import {CreateStudentDTO} from 'src/student/dtos/create-student.dto';
import {Student} from 'src/student/schemas/student.schema';
import {StudentService} from 'src/student/student.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly studentService: StudentService) {}
  @Post('register')
  async register(@Body() createStudentDTO: CreateStudentDTO): Promise<Student> {
    try {
      const createdStudent = await this.studentService.create(createStudentDTO);
      return createdStudent;
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpException('Student already exists', 409);
      }
      throw new HttpException('Internal server error', 500);
    }
  }
}
