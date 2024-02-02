import { Injectable, NotFoundException } from '@nestjs/common';
import { CitiesRepository } from './cities.repository';
import { CityModel } from '../../database/models/city.model';

@Injectable()
export class CitiesService {
  constructor(private readonly citiesRepository: CitiesRepository) {}

  public async findById(id: number): Promise<CityModel> {
    const cityModel = await this.citiesRepository.findById(id);
    if (!cityModel) {
      throw new NotFoundException('City was not found');
    }

    return cityModel;
  }

  public async findAll(): Promise<CityModel[]> {
    return this.citiesRepository.findAll();
  }
}
