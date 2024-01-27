import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Status } from '@project/libs/shared-types';
import { JwtAuthGuard } from '@project/libs/validators';
import { StatusRdo } from '@project/libs/rdo';
import { StatusesService } from './statuses.service';
import { mapToStatus } from './status-mapper';

@ApiTags('Task service')
@Controller({
  path: 'statuses',
  version: '1',
})
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Getting status information' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status information',
    type: StatusRdo,
  })
  public async getStatus(@Param('id') id: number): Promise<Status> {
    const statusModel = await this.statusesService.findById(id);
    return mapToStatus(statusModel);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Getting status list' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status list',
    isArray: true,
    type: StatusRdo,
  })
  public async getStatusList(): Promise<Status[]> {
    const statusModels = await this.statusesService.findAll();
    return statusModels.map(mapToStatus);
  }
}
