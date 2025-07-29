import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from '../interfaces/payload.interface';
import { Request } from 'express';
import { Token } from '../enums/tokens-name.enum';
import { UserFromRequest } from '../interfaces/user-from-request.interface';
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.[Token.ACCESS_TOKEN],
      ]),
      secretOrKey: configService.get<string>('jwt.accessSecret'),
      ignoreExpiration: false,
    });
  }
  validate(payload: Payload): UserFromRequest {
    return { _id: payload.sub, email: payload.email };
  }
}
