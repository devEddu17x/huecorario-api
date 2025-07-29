import { Request } from 'express';
import { UserFromRequest } from './user-from-request.interface';

export interface CustomRequest extends Request {
  user: UserFromRequest;
  token: string;
}
