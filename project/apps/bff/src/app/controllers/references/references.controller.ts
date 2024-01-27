import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { City, Role, Status } from '@project/libs/shared-types';
import { ApiGatewayConfig } from '@project/libs/config';
import { CityRdo, RoleRdo, StatusRdo } from '@project/libs/rdo';
import { CheckAuthGuard } from '../../guards/check-auth.guard';

const { microserviceConfig } = ApiGatewayConfig;

@Controller('references')
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status list',
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
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status information',
    type: StatusRdo,
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'City list',
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
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'City information',
    type: CityRdo,
  })
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

  @Get('roles/:roleId')
  @ApiOperation({ summary: 'Getting role information' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role information',
    type: RoleRdo,
  })
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

  @Get('roles')
  @ApiOperation({ summary: 'Getting role list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role information',
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
}
