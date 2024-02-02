import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  refs,
} from '@nestjs/swagger';
import { Contractor, Customer, Uuid } from '@project/libs/shared-types';
import { JwtAuthGuard } from '@project/libs/validators';
import { ApiAuth } from '@project/libs/decorators';
import { ChangeProfileDto } from '@project/libs/dto';
import { ContractorUserRdo, CustomerUserRdo } from '@project/libs/rdo';
import { mapToUserByRole } from './user-mapper';
import { UsersService } from './users.service';

@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('User service')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  @ApiAuth()
  @ApiOperation({
    summary: 'Getting contractor/customer detailed information',
  })
  @ApiParam({
    name: 'userId',
    type: String,
    format: 'UUID',
  })
  @ApiExtraModels(ContractorUserRdo, CustomerUserRdo)
  @ApiOkResponse({
    description: 'Contractor/customer information successfully received',
    schema: { oneOf: refs(ContractorUserRdo, CustomerUserRdo) },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'User was not found' })
  public async getUser(
    @Param('userId', ParseUUIDPipe) userId: Uuid
  ): Promise<Customer | Contractor> {
    const userModel = await this.usersService.findById(userId);
    return mapToUserByRole(userModel);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':userId/profile')
  @ApiAuth()
  @ApiOperation({ summary: 'Change contractor/customer profile info' })
  @ApiParam({
    name: 'userId',
    type: String,
    format: 'UUID',
  })
  @ApiExtraModels(ContractorUserRdo, CustomerUserRdo)
  @ApiOkResponse({
    description: 'Contractor/customer information successfully updated',
    schema: { oneOf: refs(ContractorUserRdo, CustomerUserRdo) },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'User was not found' })
  public async changeProfile(
    @Param('userId', ParseUUIDPipe) userId: Uuid,
    @Body() dto: ChangeProfileDto
  ): Promise<Customer | Contractor> {
    const userModel = await this.usersService.changeProfile(dto, userId);
    return mapToUserByRole(userModel);
  }
}
