import {
  RefreshTokenModel,
  RefreshTokenModelProperties,
} from '../../database/models/refresh-token.model';
import { Inject } from '@nestjs/common';

export class RefreshTokenRepository {
  constructor(
    @Inject(RefreshTokenModel)
    private readonly refreshTokenModel: typeof RefreshTokenModel
  ) {}

  public async findByTokenId(tokenId: string) {
    return this.refreshTokenModel.query().select('').where({ tokenId }).first();
  }

  public async create(
    refreshTokenData: RefreshTokenModelProperties
  ): Promise<RefreshTokenModel> {
    return this.refreshTokenModel
      .query()
      .insert(refreshTokenData)
      .returning('*');
  }

  public async deleteByTokenId(tokenId: string) {
    await this.refreshTokenModel.query().where({ token_id: tokenId }).delete();
  }

  public async deleteExpiredTokens() {
    await this.refreshTokenModel
      .query()
      .where('expiresIn', '<', this.refreshTokenModel.raw('NOW()'))
      .delete();
  }
}
