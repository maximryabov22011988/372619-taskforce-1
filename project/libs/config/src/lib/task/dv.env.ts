import { IsNumber, IsString, Max, Min } from 'class-validator';

const MIN_PORT = 0;
const MAX_PORT = 65535;

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
  @Min(MIN_PORT)
  @Max(MAX_PORT)
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
