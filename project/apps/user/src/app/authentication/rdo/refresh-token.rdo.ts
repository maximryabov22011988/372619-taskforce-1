import { Expose } from 'class-transformer';

export class RefreshTokenRdo {
  @Expose()
  public accessToken: string;

  @Expose()
  public refreshToken: string;
}
