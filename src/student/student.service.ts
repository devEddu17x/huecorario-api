import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Student} from './schemas/student.schema';
import {CreateStudentDTO} from './dtos/create-student.dto';

@Injectable()
export class StudentService {
  constructor(@InjectModel(Student.name) private catModel: Model<Student>) {}

  async create(createStudentDTO: CreateStudentDTO) {
    const createdStudent = new this.catModel(createStudentDTO);
    return createdStudent.save();
  }
}
