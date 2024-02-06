import { IsNumber, IsString, Max, Min } from 'class-validator';
import { Port } from '@project/libs/shared-types';

export class DbEnv {
  @IsString({
    message: 'Database name is required',
  })
  public name: string;

  @IsString({
    message: 'PostgreSQL host is required',
  })
  public host: string;

  @IsNumber(
    {},
    {
      message: 'PostgreSQL port is required',
    }
  )
  @Min(Port.Min)
  @Max(Port.Max)
  public port: number;

  @IsString({
    message: 'PostgreSQL user is required',
  })
  public user: string;

  @IsString({
    message: 'PostgreSQL password is required',
  })
  public password: string;
}
