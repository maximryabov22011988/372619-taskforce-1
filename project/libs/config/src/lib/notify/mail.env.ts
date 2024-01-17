import { IsNumber, IsString, Max, Min } from 'class-validator';

const MIN_PORT = 0;
const MAX_PORT = 65535;

export class MailEnv {
  @IsString({
    message: 'Mail host is required',
  })
  public host: string;

  @IsNumber(
    {},
    {
      message: 'Mail port is required',
    }
  )
  @Min(MIN_PORT)
  @Max(MAX_PORT)
  public port: number;

  @IsString({
    message: 'Mail user is required',
  })
  public user: string;

  @IsString({
    message: 'Mail password is required',
  })
  public password: string;

  @IsString({
    message: 'Sender email is required',
  })
  public from: string;
}
