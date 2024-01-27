import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import dayjs from 'dayjs';
import { UserConfig } from '@project/libs/config';
import { RefreshTokenPayload } from '@project/libs/shared-types';
import { parseTime } from '@project/libs/utils-core';
import { DateTimeService } from '@project/libs/services';
import { RefreshTokenRepository } from './refresh-token.repository';

const { jwtConfig } = UserConfig;

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly dateTimeService: DateTimeService,
    @Inject(jwtConfig.KEY)
    private readonly jwtOptions: ConfigType<typeof jwtConfig>
  ) {}

  public async createRefreshSession(payload: RefreshTokenPayload) {
    const timeValue = parseTime(this.jwtOptions.refreshTokenExpiresIn);

    return this.refreshTokenRepository.create({
      tokenId: payload.tokenId,
      userId: payload.sub,
      expiresIn: this.dateTimeService.add(timeValue).toISOString(),
    });
  }

  public async deleteRefreshSession(tokenId: string) {
    await this.refreshTokenRepository.deleteByTokenId(tokenId);
  }

  public async isExists(tokenId: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findByTokenId(
      tokenId
    );

    return Boolean(refreshToken);
  }

  public async deleteExpiredRefreshTokens() {
    await this.refreshTokenRepository.deleteExpiredTokens();
  }
}
