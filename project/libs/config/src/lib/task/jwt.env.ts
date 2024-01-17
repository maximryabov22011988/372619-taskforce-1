import { IsString, IsNotEmpty } from 'class-validator';

export class JwtEnv {
  @IsNotEmpty()
  @IsString()
  public accessTokenSecret: string;

  @IsNotEmpty()
  @IsString()
  public accessTokenExpiresIn: string;
}
