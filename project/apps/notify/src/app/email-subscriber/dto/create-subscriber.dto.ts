import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSubscriberDto {
  @IsEmail({}, { message: 'The email is not valid' })
  public email: string;

  @IsNotEmpty({ message: 'The first name is empty' })
  public firstname: string;

  @IsNotEmpty({ message: 'The last name is empty' })
  public lastname: string;
}
