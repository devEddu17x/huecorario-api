import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, startWith } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Token } from '../enums/tokens-name.enum';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.cookies?.[Token.REFRESH_TOKEN];
    if (token) {
      req.token = token;
    }
    return super.canActivate(context);
  }
}
