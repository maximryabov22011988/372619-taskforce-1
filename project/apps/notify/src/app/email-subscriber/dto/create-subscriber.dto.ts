import { IsNotEmpty, IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty()
  @IsUUID(4)
  public userId: string;

  @IsNotEmpty()
  @IsString()
  public title: string;

  @IsNotEmpty()
  @IsString()
  public description: string;

  @IsNotEmpty()
  @IsString()
  public city: string;

  @IsNotEmpty()
  @IsNumber()
  public price: number;
}
