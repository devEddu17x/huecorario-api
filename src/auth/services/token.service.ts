import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../interfaces/payload.interface';
@Injectable()
export class TokenService {
  constructor(
    @Inject('ACCESS_JWT_SERVICE')
    private readonly accessJwtService: JwtService,
    @Inject('REFRESH_JWT_SERVICE')
    private readonly refreshJwtService: JwtService,
  ) {
    if (!this.accessJwtService || !this.refreshJwtService) {
      throw new Error('JWT services not properly configured');
    }
  }

  async generatePairTokens(payload: Payload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.accessJwtService.signAsync(payload),
      this.refreshJwtService.signAsync(payload),
    ]);

    return { accessToken, refreshToken };
  }
}
