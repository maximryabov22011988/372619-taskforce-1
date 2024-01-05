import { Injectable, Inject } from '@nestjs/common';
import isNaN from 'lodash/isNaN';
import dayjs, { OpUnitType, Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/ru';

export const DAYJS_REGISTER_NAME = 'dayjs';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.locale('ru');

@Injectable()
export class DateTimeService {
  public static UTC_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';

  public static DATE_FORMAT = 'YYYY-MM-DD';

  constructor(
    @Inject(DAYJS_REGISTER_NAME) private readonly dateTime: typeof dayjs
  ) {}

  public getDate(date?: Date | string): Dayjs {
    const dayJsDate = date ? this.dateTime(date) : this.dateTime();
    if (!dayJsDate.isValid()) {
      throw new Error('Invalid date');
    }

    return dayJsDate;
  }

  public getFormattedDate(date: Date | string, format: string): string {
    return this.getDate(date).format(format);
  }

  public formatDate(date: Date | string | number, format?: string): string {
    return this.dateTime(date).format(format ?? DateTimeService.UTC_FORMAT);
  }

  public getDiff(date: string, unit: OpUnitType): number {
    const diff = this.dateTime().diff(date, unit);
    if (isNaN(diff)) {
      throw new Error('Invalid date');
    }

    return this.dateTime().diff(date, unit);
  }
}

export const dateTimeService = new DateTimeService(dayjs);
