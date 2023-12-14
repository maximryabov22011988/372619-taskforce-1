import { Injectable, Inject } from '@nestjs/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

export const DAYJS_REGISTER_NAME = 'dayjs';

@Injectable()
export class DateTimeService {
  public static UTC_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';

  public static HUMAN_FORMAT = 'DD.MM.YYYY HH:mm';

  constructor(
    @Inject(DAYJS_REGISTER_NAME) private readonly dateTime: typeof dayjs
  ) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
  }

  public getDateTimeLocale(format?: string, date?: string): string {
    return this.dateTime
      .utc(date)
      .format(format ?? DateTimeService.HUMAN_FORMAT);
  }
}
