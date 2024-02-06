import { IsNumber, IsString, Max, Min, IsEnum } from 'class-validator';
import { Environment, Port } from '@project/libs/shared-types';

export class AppEnv {
  @IsString({
    message: `Environment is required and value should be ${Object.values(
      Environment
    ).join(', ')}`,
  })
  @IsEnum(Environment)
  public environment: Environment;

  @IsNumber(
    {},
    {
      message: 'App port is required',
    }
  )
  @Min(Port.Min)
  @Max(Port.Max)
  public port: number;

  @IsString({
    message: `Environment is required. Example: "uploads"`,
  })
  public uploadDirectory: string;

  @IsString({
    message: `Environment is required. Example: "/api/static"`,
  })
  public uploadServePath: string;
}
