import { Controller, Get, Inject, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { City, Role, Status } from '@project/libs/shared-types';
import { BffConfig } from '@project/libs/config';
import { CityRdo, RoleRdo, StatusRdo } from '@project/libs/rdo';

const { microserviceConfig } = BffConfig;

@Controller('references')
@ApiTags('References')
export class ReferencesController {
  private readonly baseCitiesUrl: string;
  private readonly baseRolesUrl: string;
  private readonly baseStatusesUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(microserviceConfig.KEY)
    private readonly serviceConfig: ConfigType<typeof microserviceConfig>
  ) {
    const { taskServiceUrl, userServiceUrl } = this.serviceConfig;

    this.baseCitiesUrl = `${taskServiceUrl}/v1/cities`;
    this.baseStatusesUrl = `${taskServiceUrl}/v1/statuses`;
    this.baseRolesUrl = `${userServiceUrl}/v1/roles`;
  }

  @Get('statuses')
  @ApiOperation({ summary: 'Getting status list' })
  @ApiOkResponse({
    description: 'Status list successfully received',
    isArray: true,
    type: StatusRdo,
  })
  public async getStatusList(): Promise<Status[]> {
    const { data } = await this.httpService.axiosRef.get(this.baseStatusesUrl);

    return data;
  }

  @Get('statuses/:id')
  @ApiOperation({ summary: 'Getting status information' })
  @ApiOkResponse({
    description: 'Status information successfully received',
    type: StatusRdo,
  })
  @ApiNotFoundResponse({ description: 'Status was not found' })
  public async getStatus(@Param('id') id: number): Promise<Status> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.baseStatusesUrl}/${id}`
    );

    return data;
  }

  @Get('cities')
  @ApiOperation({ summary: 'Getting city list' })
  @ApiOkResponse({
    description: 'City list successfully received',
    isArray: true,
    type: CityRdo,
  })
  public async getCityList(): Promise<City[]> {
    const { data } = await this.httpService.axiosRef.get(this.baseCitiesUrl);

    return data;
  }

  @Get('cities/:id')
  @ApiOperation({ summary: 'Getting city information' })
  @ApiOkResponse({
    description: 'City information successfully received',
    type: CityRdo,
  })
  @ApiNotFoundResponse({ description: 'City was not found' })
  public async getCity(@Param('id') id: number): Promise<City> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.baseCitiesUrl}/${id}`
    );

    return data;
  }

  @Get('roles')
  @ApiOperation({ summary: 'Getting role list' })
  @ApiOkResponse({
    description: 'Role list successfully received',
    isArray: true,
    type: RoleRdo,
  })
  public async getRoleList(): Promise<Role[]> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.baseRolesUrl}`
    );

    return data;
  }

  @Get('roles/:roleId')
  @ApiOperation({ summary: 'Getting role information' })
  @ApiOkResponse({
    description: 'Role information successfully received',
    type: RoleRdo,
  })
  @ApiNotFoundResponse({ description: 'Role was not found' })
  public async getRole(@Param('roleId') roleId: number): Promise<Role> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.baseRolesUrl}/${roleId}`
    );

    return data;
  }
}
