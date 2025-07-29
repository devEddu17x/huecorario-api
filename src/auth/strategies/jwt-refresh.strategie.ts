import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from '../interfaces/payload.interface';
import { Request } from 'express';
import { Token } from '../enums/tokens-name.enum';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.[Token.REFRESH_TOKEN],
      ]),
      secretOrKey: configService.get<string>('jwt.refreshSecret'),
      ignoreExpiration: false,
    });
  }
  validate(payload: Payload): any {
    return { _id: payload.sub, email: payload.email };
  }
}
