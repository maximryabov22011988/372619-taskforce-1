import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { ConfigType } from '@nestjs/config';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { UserConfig } from '@project/libs/config';
import {
  Contractor,
  Customer,
  RabbitRouting,
  UserRoleId,
  Uuid,
} from '@project/libs/shared-types';
import { JwtAuthGuard } from '@project/libs/validators';
import { ChangeProfileDto } from '@project/libs/dto';
import { ContractorUserRdo, CustomerUserRdo } from '@project/libs/rdo';
import { mapToUserByRole } from './user-mapper';
import { UsersService } from './users.service';

@ApiTags('User service')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  @ApiOperation({ summary: 'Getting detailed information' })
  @ApiExtraModels(ContractorUserRdo, CustomerUserRdo)
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contractor or customer user information',
    schema: { oneOf: refs(ContractorUserRdo, CustomerUserRdo) },
  })
  public async getUser(
    @Param('userId', ParseUUIDPipe) userId: Uuid
  ): Promise<Customer | Contractor> {
    const userModel = await this.usersService.findById(userId);

    return mapToUserByRole(userModel);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':userId/profile')
  @ApiOperation({ summary: 'Change user profile info' })
  @ApiExtraModels(ContractorUserRdo, CustomerUserRdo)
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
    description: 'Contractor or customer user information',
    schema: { oneOf: refs(ContractorUserRdo, CustomerUserRdo) },
  })
  public async changeProfile(
    @Param('userId', ParseUUIDPipe) userId: Uuid,
    @Body() dto: ChangeProfileDto
  ): Promise<Customer | Contractor> {
    const userModel = await this.usersService.changeProfile(dto, userId);
    return mapToUserByRole(userModel);
  }
}
