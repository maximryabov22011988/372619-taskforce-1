import { Inject, Injectable } from '@nestjs/common';
import { CityModel } from '../../database/models/city.model';

@Injectable()
export class CitiesRepository {
  constructor(
    @Inject(CityModel) private readonly cityModel: typeof CityModel
  ) {}

  public async findById(id: number): Promise<CityModel> {
    return this.cityModel.query().where({ id }).returning('*').first();
  }

  public async findAll(): Promise<CityModel[]> {
    return this.cityModel.query().select('*').execute();
  }
}
