import { Expose } from 'class-transformer';

export class LoggedUserRdo {
  @Expose()
  public accessToken: string;
}
