import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../interfaces/payload.interface';
import { Token } from '../enums/tokens-name.enum';
import { parseTimeString } from 'src/common/utils/parseTimeString';
import { CacheService } from 'src/cache/cache.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class TokenService {
  constructor(
    @Inject('ACCESS_JWT_SERVICE')
    private readonly accessJwtService: JwtService,
    @Inject('REFRESH_JWT_SERVICE')
    private readonly refreshJwtService: JwtService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
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
    await this.cacheService.setData<string>(
      `${Token.REFRESH_TOKEN}:${payload.email}`,
      refreshToken,
      parseTimeString(this.configService.get<string>('jwt.refreshExpiresIn')) /
        1000,
    );
    return { accessToken, refreshToken };
  }
}
