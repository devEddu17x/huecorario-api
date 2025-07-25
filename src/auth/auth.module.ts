import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {StudentModule} from 'src/student/student.module';

@Module({
  imports: [StudentModule],
  controllers: [AuthController],
})
export class AuthModule {}
