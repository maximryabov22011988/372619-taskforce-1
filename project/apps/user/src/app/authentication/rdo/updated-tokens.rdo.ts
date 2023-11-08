import { Expose } from 'class-transformer';

export class UpdatedTokensRdo {
  @Expose()
  public accessToken: string;

  @Expose()
  public refreshToken: string;
}
