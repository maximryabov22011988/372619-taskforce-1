import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Status } from '@project/libs/shared-types';
import { StatusRdo } from '@project/libs/rdo';
import { StatusesService } from './statuses.service';
import { mapToStatus } from './status-mapper';

@Controller({
  path: 'statuses',
  version: '1',
})
@ApiTags('Task service')
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Getting status information' })
  @ApiOkResponse({
    description: 'Status information successfully received',
    type: StatusRdo,
  })
  @ApiNotFoundResponse({ description: 'Status was not found' })
  public async getStatus(@Param('id') id: number): Promise<Status> {
    const statusModel = await this.statusesService.findById(id);
    return mapToStatus(statusModel);
  }

  @Get()
  @ApiOperation({ summary: 'Getting status list' })
  @ApiOkResponse({
    description: 'Status list successfully received',
    isArray: true,
    type: StatusRdo,
  })
  public async getStatusList(): Promise<Status[]> {
    const statusModels = await this.statusesService.findAll();
    return statusModels.map(mapToStatus);
  }
}
