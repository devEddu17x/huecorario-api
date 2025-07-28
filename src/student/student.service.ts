import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import * as bcrypt from 'bcrypt';
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

  async findByEmail(email: string): Promise<StudentDocument | null> {
    return await this.studentModel.findOne({ email });
  }

  async validateStudent(
    email: string,
    password: string,
  ): Promise<StudentDocument | null> {
    const student = await this.findByEmail(email);
    if (student && (await bcrypt.compare(password, student.password))) {
      return student;
    }
    return null;
  }
}
