import { Module } from '@nestjs/common';
import { StatusesRepository } from './statuses.repository';
import { StatusesService } from './statuses.service';
import { StatusesController } from './statuses.controller';

@Module({
  controllers: [StatusesController],
  providers: [StatusesService, StatusesRepository],
})
export class StatusesModule {}
