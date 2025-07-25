import { Injectable } from '@nestjs/common';
import { CreateStudentDTO } from 'src/student/dtos/create-student.dto';
import { StudentService } from 'src/student/student.service';
import { generateCode } from './helpers/code-generator.helper';
import { CacheService } from 'src/cache/cache.service';
import { CreateEmailResponse } from 'nestjs-resend';
import { renderTemplate } from 'src/mail/mail.template';
import { Template } from 'src/common/enums/template.enum';
import { EmailTakenError } from 'src/common/errors/email-taken.error';
import { ResendService } from 'src/mail/resend.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly studentService: StudentService,
    private readonly mailService: ResendService,
    private readonly cacheService: CacheService,
  ) {}
  async register(
    createStudentDTO: CreateStudentDTO,
  ): Promise<CreateEmailResponse> {
    const isAvailable: boolean = await this.studentService.emailIsAvailable(
      createStudentDTO.email,
    );

    if (!isAvailable) {
      throw new EmailTakenError(createStudentDTO.email);
    }
    const verificationCode: number = generateCode();
    const codeKey: string = `code:${createStudentDTO.email}`;
    const studentKey: string = `student:${createStudentDTO.email}`;
    await Promise.all([
      await this.cacheService.setData<number>(codeKey, verificationCode, 600), // 10 minutes
      await this.cacheService.setData<CreateStudentDTO>(
        studentKey,
        createStudentDTO,
        600, // 10 minutes
      ),
    ]);
    const template = await renderTemplate(Template.EMAIL_CONFIRMATION, {
      code: verificationCode,
    });
    const response: CreateEmailResponse = await this.mailService.sendEmail(
      createStudentDTO.email,
      'Verify your email',
      template,
    );
    return response;
  }
}
