import {Module} from '@nestjs/common';
import {StudentService} from './student.service';
import {MongooseModule} from '@nestjs/mongoose';
import {Student, StudentSchema} from './schemas/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Student.name, schema: StudentSchema}]),
  ],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
