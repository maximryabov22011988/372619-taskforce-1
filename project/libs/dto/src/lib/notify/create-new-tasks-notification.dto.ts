import { IsNotEmpty, IsArray, IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskRdo } from '@project/libs/rdo';

export class CreateNewTasksNotificationDto {
  @IsNotEmpty()
  @IsArray()
  @IsEmail({}, { each: true })
  public emails: string[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskRdo)
  public tasks: TaskRdo[];
}
