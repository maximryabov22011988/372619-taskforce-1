import { Inject, Injectable } from '@nestjs/common';
import { StatusModel } from '../../database/models/status.model';

@Injectable()
export class StatusesRepository {
  constructor(
    @Inject(StatusModel) private readonly cityModel: typeof StatusModel
  ) {}

  public async findById(id: number): Promise<StatusModel> {
    return this.cityModel.query().where({ id }).returning('*').first();
  }

  public async findAll(): Promise<StatusModel[]> {
    return this.cityModel.query().select('*').execute();
  }
}
