import { IsNumber, IsString, Max, Min } from 'class-validator';

const MIN_PORT = 0;
const MAX_PORT = 65535;

export class RabbitMqEnv {
  @IsString({
    message: 'RabbitMq host is required',
  })
  public host: string;

  @IsNumber(
    {},
    {
      message: 'RabbitMq port is required',
    }
  )
  @Min(MIN_PORT)
  @Max(MAX_PORT)
  public port: number;

  @IsString({
    message: 'RabbitMq user is required',
  })
  public user: string;

  @IsString({
    message: 'RabbitMq password is required',
  })
  public password: string;

  @IsString({
    message: 'RabbitMq queue is required',
  })
  public queue: string;

  @IsString({
    message: 'RabbitMq exchange is required',
  })
  public exchange: string;
}
