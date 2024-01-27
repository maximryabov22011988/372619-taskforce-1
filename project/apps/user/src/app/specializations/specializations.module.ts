import { Module } from '@nestjs/common';
import { SpecializationsRepository } from './specializations.repository';
import { SpecializationsService } from './specializations.service';

@Module({
  providers: [SpecializationsRepository, SpecializationsService],
  exports: [SpecializationsService],
})
export class SpecializationsModule {}
