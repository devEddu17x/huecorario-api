import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from './schemas/student.schema';
import { CreateStudentDTO } from './dtos/create-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  async create(createStudentDTO: CreateStudentDTO): Promise<Student> {
    const createdStudent = new this.studentModel(createStudentDTO);
    return createdStudent.save();
  }

  async emailIsAvailable(email: string): Promise<boolean> {
    const student = await this.studentModel.findOne({ email });
    return !student;
  }
}
