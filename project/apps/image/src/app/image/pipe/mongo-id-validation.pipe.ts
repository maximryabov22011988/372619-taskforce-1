import {
  BadRequestException,
  PipeTransform,
  ArgumentMetadata,
} from '@nestjs/common';
import { Types } from 'mongoose';

export class MongoIdValidationPipe implements PipeTransform {
  public transform(value: string, { type }: ArgumentMetadata) {
    if (type !== 'param') {
      throw new Error('This pipe must used only with params!');
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid mongo identifier');
    }

    return value;
  }
}
