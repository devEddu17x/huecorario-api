import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Student} from './schemas/student.schema';

@Injectable()
export class StudentService {
  constructor(@InjectModel(Student.name) private catModel: Model<Student>) {}
}
