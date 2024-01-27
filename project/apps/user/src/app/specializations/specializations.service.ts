import { Injectable } from '@nestjs/common';
import { Uuid } from '@project/libs/shared-types';
import { SpecializationModel } from '../../database/models/specialization.model';
import { SpecializationsRepository } from './specializations.repository';

const MAX_SPECIALIZATIONS = 5;

@Injectable()
export class SpecializationsService {
  constructor(
    private readonly specializationsRepository: SpecializationsRepository
  ) {}

  public async findAllSpecializationsByUser(
    userId: Uuid
  ): Promise<SpecializationModel[]> {
    return this.specializationsRepository.findAllByUser(userId);
  }

  public async createSpecializations(
    specializationList: string[],
    userId: Uuid
  ): Promise<void> {
    const specializations = this.getSpecializations(specializationList);

    for (const specialization of specializations) {
      await this.specializationsRepository.create(specialization, userId);
    }
  }

  public async updateSpecializations(
    specializationList: string[],
    userId: Uuid
  ): Promise<void> {
    const existedSpecializationsModels =
      await this.findAllSpecializationsByUser(userId);
    const existedSpecializations = existedSpecializationsModels.map(
      ({ name }) => name
    );

    const newSpecializations = this.getSpecializations(specializationList);

    const mergedSpecializations = Array.from(
      new Set([...existedSpecializations, ...newSpecializations])
    );

    const specializationsForDelete = mergedSpecializations.filter(
      (specialization) =>
        existedSpecializations.includes(specialization) &&
        !newSpecializations.includes(specialization)
    );
    for (const specialization of specializationsForDelete) {
      await this.specializationsRepository.delete(specialization, userId);
    }

    const specializationsForCreate = mergedSpecializations.filter(
      (specialization) =>
        !existedSpecializations.includes(specialization) &&
        newSpecializations.includes(specialization)
    );
    await this.createSpecializations(specializationsForCreate, userId);
  }

  private getSpecializations(specializations: string[]): string[] {
    const uniqSpecializations = new Set([...specializations]);
    const slicedSpecializations = Array.from(uniqSpecializations).slice(
      0,
      MAX_SPECIALIZATIONS
    );

    return this.formatSpecializations(slicedSpecializations);
  }

  private formatSpecializations(specializationList: string[]): string[] {
    return specializationList.map((specialization) =>
      specialization.toLowerCase()
    );
  }
}
