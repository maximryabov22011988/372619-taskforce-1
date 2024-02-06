import { IsNumber, IsString, Max, Min } from 'class-validator';
import { Port } from '@project/libs/shared-types';

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
  @Min(Port.Min)
  @Max(Port.Max)
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
