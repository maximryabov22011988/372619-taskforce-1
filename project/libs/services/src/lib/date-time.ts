import { Injectable, Inject } from '@nestjs/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ru';

export const DAYJS_REGISTER_NAME = 'dayjs';

@Injectable()
export class DateTimeService {
  public static UTC_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';

  public static DATE_FORMAT = 'YYYY-MM-DD';

  constructor(
    @Inject(DAYJS_REGISTER_NAME) private readonly dateTime: typeof dayjs
  ) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.locale('ru');
  }

  public formatDate(date: Date | string, format?: string): string {
    return this.dateTime(date).format(format ?? DateTimeService.UTC_FORMAT);
  }
}
