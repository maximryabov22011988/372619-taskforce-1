import dayjs from 'dayjs';
import { Module } from '@nestjs/common';
import { DateTimeService, DAYJS_REGISTER_NAME } from '@project/services';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';

@Module({
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    DateTimeService,
    {
      provide: DAYJS_REGISTER_NAME,
      useValue: dayjs,
    },
  ],
})
export class CommentsModule {}
