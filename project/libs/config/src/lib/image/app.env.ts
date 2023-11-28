import { IsNumber, IsString, Max, Min, IsEnum } from 'class-validator';

const MIN_PORT = 0;
const MAX_PORT = 65535;

enum Environment {
  Development = 'development',
  Production = 'production',
  Stage = 'stage',
}

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
  @Min(MIN_PORT)
  @Max(MAX_PORT)
  public port: number;

  @IsString({
    message: `Environment is required. Example: "uploads"`,
  })
  public staticPath: string;

  @IsString({
    message: `Environment is required. Example: "/api/static"`,
  })
  public staticServePath: string;
}
