import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@project/libs/validators';
import { City } from '@project/libs/shared-types';
import { CityRdo } from '@project/libs/rdo';
import { CitiesService } from './cities.service';
import { mapToCity } from './city-mapper';

@ApiTags('Task service')
@Controller({
  path: 'cities',
  version: '1',
})
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Getting city information' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'City information',
    type: CityRdo,
  })
  public async getCity(@Param('id') id: number): Promise<City> {
    const cityModel = await this.citiesService.findById(id);
    return mapToCity(cityModel);
  }

  @Get()
  @ApiOperation({ summary: 'Getting city list' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'City list',
    isArray: true,
    type: CityRdo,
  })
  public async getCityList(): Promise<City[]> {
    const cityModels = await this.citiesService.findAll();
    return cityModels.map(mapToCity);
  }
}
