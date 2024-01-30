import { Controller, Get, Inject, Param, Req } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
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
  public async getStatusList(@Req() req: Request): Promise<Status[]> {
    const { data } = await this.httpService.axiosRef.get(this.baseStatusesUrl, {
      headers: {
        Authorization: req.headers['authorization'],
      },
    });

    return data;
  }

  @Get('statuses/:id')
  @ApiOperation({ summary: 'Getting status information' })
  @ApiOkResponse({
    description: 'Status information successfully received',
    type: StatusRdo,
  })
  @ApiNotFoundResponse({ description: 'Status was not found' })
  public async getStatus(
    @Param('id') id: number,
    @Req() req: Request
  ): Promise<Status> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.baseStatusesUrl}/${id}`,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
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
  public async getCityList(@Req() req: Request): Promise<City[]> {
    const { data } = await this.httpService.axiosRef.get(this.baseCitiesUrl, {
      headers: {
        Authorization: req.headers['authorization'],
      },
    });

    return data;
  }

  @Get('cities/:id')
  @ApiOperation({ summary: 'Getting city information' })
  @ApiOkResponse({
    description: 'City information successfully received',
    type: CityRdo,
  })
  @ApiNotFoundResponse({ description: 'City was not found' })
  public async getCity(
    @Param('id') id: number,
    @Req() req: Request
  ): Promise<City> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.baseCitiesUrl}/${id}`,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
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
  public async getRoleList(@Req() req: Request): Promise<Role[]> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.baseRolesUrl}`,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
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
  public async getRole(
    @Param('roleId') roleId: number,
    @Req() req: Request
  ): Promise<Role> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.baseRolesUrl}/${roleId}`,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }
}
