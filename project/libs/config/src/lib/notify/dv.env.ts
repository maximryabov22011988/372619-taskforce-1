import { IsNumber, IsString, Max, Min } from 'class-validator';

const MIN_PORT = 0;
const MAX_PORT = 65535;

export class DbEnv {
  @IsString({
    message: 'Database name is required',
  })
  public name: string;

  @IsString({
    message: 'MongoDB host is required',
  })
  public host: string;

  @IsNumber(
    {},
    {
      message: 'MongoDB port is required',
    }
  )
  @Min(MIN_PORT)
  @Max(MAX_PORT)
  public port: number;

  @IsString({
    message: 'MongoDB user is required',
  })
  public user: string;

  @IsString({
    message: 'MongoDB password is required',
  })
  public password: string;

  @IsString({
    message: 'MongoDB authentication base is required',
  })
  public authBase: string;
}
