import { PipeTransform, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export class MongoIdValidationPipe implements PipeTransform {
  public transform(value: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid mongo identifier');
    }

    return value;
  }
}
