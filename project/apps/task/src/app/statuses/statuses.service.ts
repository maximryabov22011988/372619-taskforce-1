import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatusId } from '@project/libs/shared-types';
import { StatusesRepository } from './statuses.repository';
import { StatusModel } from '../../database/models/status.model';

@Injectable()
export class StatusesService {
  constructor(private readonly statusesRepository: StatusesRepository) {}

  public async findById(id: number): Promise<StatusModel> {
    const statusModel = await this.statusesRepository.findById(id);
    if (!statusModel) {
      throw new NotFoundException(
        `Status was not found. Available statuses: ${Object.values(
          TaskStatusId
        ).join(', ')}`
      );
    }

    return statusModel;
  }

  public async findAll(): Promise<StatusModel[]> {
    return this.statusesRepository.findAll();
  }
}
