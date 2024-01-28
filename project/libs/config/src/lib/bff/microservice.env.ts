import { IsString } from 'class-validator';

export class MicroserviceEnv {
  @IsString({
    message: 'User microservice url is required',
  })
  public userServiceUrl: string;

  @IsString({
    message: 'Image microservice url is required',
  })
  public imageServiceUrl: string;

  @IsString({
    message: 'Task microservice url is required',
  })
  public taskServiceUrl: string;

  @IsString({
    message: 'Static url is required',
  })
  public staticUrl: string;
}
