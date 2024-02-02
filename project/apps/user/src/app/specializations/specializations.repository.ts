import { Inject, Injectable } from '@nestjs/common';
import { Uuid } from '@project/libs/shared-types';
import { SpecializationModel } from '../../database/models/specialization.model';
import { UsersSpecializationsModel } from '../../database/models/users-spectializations.model';

@Injectable()
export class SpecializationsRepository {
  constructor(
    @Inject(SpecializationModel)
    private readonly specializationModel: typeof SpecializationModel,
    @Inject(UsersSpecializationsModel)
    private readonly usersSpecializationsModel: typeof UsersSpecializationsModel
  ) {}

  public async findByName(name: string): Promise<SpecializationModel> {
    return this.specializationModel
      .query()
      .where({ name })
      .returning('*')
      .first();
  }

  public async findAllByUser(userId: Uuid): Promise<SpecializationModel[]> {
    const userSpecializationModels = await this.usersSpecializationsModel
      .query()
      .where({ userId })
      .returning('*')
      .execute();

    const ids = userSpecializationModels.map(
      ({ specializationId }) => specializationId
    );

    return this.specializationModel
      .query()
      .whereIn('id', ids)
      .returning('*')
      .execute();
  }

  public async create(
    specializationName: string,
    userId: Uuid
  ): Promise<SpecializationModel> {
    let specializationModel = await this.findByName(specializationName);
    if (!specializationModel) {
      specializationModel = await this.specializationModel
        .query()
        .insert({ name: specializationName })
        .returning('*');
    }

    await this.usersSpecializationsModel
      .query()
      .insert({ specializationId: specializationModel.id, userId });

    return specializationModel;
  }

  public async delete(specializationName: string, userId: Uuid): Promise<void> {
    const specializationModel = await this.findByName(specializationName);
    const userSpecializationModels = await this.usersSpecializationsModel
      .query()
      .where({ specializationId: specializationModel.id })
      .whereNot({ userId });

    await this.usersSpecializationsModel
      .query()
      .where({ specializationId: specializationModel.id, userId })
      .delete();

    const isUsedOtherUsers = userSpecializationModels.length;
    if (!isUsedOtherUsers) {
      await this.specializationModel
        .query()
        .where({ id: specializationModel.id })
        .delete();
    }
  }
}
