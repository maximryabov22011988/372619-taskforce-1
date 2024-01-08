import {
  registerDecorator,
  ValidatorConstraint,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { dateTimeService } from '@project/libs/services';

const MIN_AGE = 18;

@ValidatorConstraint({ name: 'MinimumValidAge', async: false })
class MinimumValidAgeValidator implements ValidatorConstraintInterface {
  public validate(dateOfBirth: string): boolean {
    const currentDate = dateTimeService.getDate();
    const birthDate = dateTimeService.getDate(dateOfBirth);
    const age = currentDate.diff(birthDate, 'year');
    return age > MIN_AGE;
  }

  public defaultMessage(): string {
    return 'User must be at least 18 years old';
  }
}

export const MinimumValidAge =
  (property: number, validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) => {
    registerDecorator({
      name: 'MinimumValidAge',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: MinimumValidAgeValidator,
    });
  };
