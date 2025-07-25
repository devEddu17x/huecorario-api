import {BadRequestException} from '@nestjs/common';

export class EmailTakenError extends BadRequestException {
  constructor(email: string) {
    super(`Email ${email} is already in use`);
  }
}
