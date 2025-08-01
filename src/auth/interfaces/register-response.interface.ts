import { StudentDocument } from 'src/student/schemas/student.schema';

export interface RegisterResponse {
  student: StudentDocument;
  tokenExpiresIn: string;
}
