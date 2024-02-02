import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { City } from '@project/libs/shared-types';
import { CityRdo } from '@project/libs/rdo';
import { CitiesService } from './cities.service';
import { mapToCity } from './city-mapper';

@Controller({
  path: 'cities',
  version: '1',
})
@ApiTags('Task service')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Getting city information' })
  @ApiOkResponse({
    description: 'City information successfully received',
    type: CityRdo,
  })
  @ApiNotFoundResponse({ description: 'City was not found' })
  public async getCity(@Param('id') id: number): Promise<City> {
    const cityModel = await this.citiesService.findById(id);
    return mapToCity(cityModel);
  }

  @Get()
  @ApiOperation({ summary: 'Getting city list' })
  @ApiOkResponse({
    description: 'City list successfully received',
    isArray: true,
    type: CityRdo,
  })
  public async getCityList(): Promise<City[]> {
    const cityModels = await this.citiesService.findAll();
    return cityModels.map(mapToCity);
  }
}
