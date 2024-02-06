import { IsNumber, IsString, Max, Min } from 'class-validator';
import { Port } from '@project/libs/shared-types';

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
  @Min(Port.Min)
  @Max(Port.Max)
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
