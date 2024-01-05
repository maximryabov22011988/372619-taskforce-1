import {
  registerDecorator,
  ValidatorConstraint,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { dateTimeService } from '@project/services';

@ValidatorConstraint({ name: 'IsSameOrAfterToday', async: false })
class IsSameOrAfterTodayValidator implements ValidatorConstraintInterface {
  public validate(value: string): boolean {
    const currentDate = dateTimeService.getDate();
    const dateToValidate = dateTimeService.getDate(value);

    return dateToValidate.isSameOrAfter(currentDate, 'day');
  }

  public defaultMessage(): string {
    return 'Date must not be earlier today';
  }
}

export const IsSameOrAfterToday =
  (validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSameOrAfterTodayValidator,
    });
  };
