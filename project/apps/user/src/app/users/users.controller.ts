import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Patch,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiExtraModels,
  refs,
} from '@nestjs/swagger';
import { Contractor, Customer, Uuid } from '@project/libs/shared-types';
import { JwtAuthGuard } from '@project/libs/validators';
import { mapToUserByRole } from './users.mapper';
import { UsersService } from './users.service';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { ContractorUserRdo } from './rdo/contractor-user.rdo';
import { CustomerUserRdo } from './rdo/customer-user.rdo';

@ApiTags('User service')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:userId')
  @ApiOperation({ summary: 'Getting detailed information' })
  @ApiExtraModels(ContractorUserRdo, CustomerUserRdo)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contractor or customer user information',
    schema: { oneOf: refs(ContractorUserRdo, CustomerUserRdo) },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async getUser(
    @Param('userId', ParseUUIDPipe) userId: Uuid
  ): Promise<Customer | Contractor> {
    const userModel = await this.usersService.findById(userId);
    return mapToUserByRole(userModel);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:userId/profile')
  @ApiOperation({ summary: 'Change profile info' })
  @ApiExtraModels(ContractorUserRdo, CustomerUserRdo)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contractor or customer user information',
    schema: { oneOf: refs(ContractorUserRdo, CustomerUserRdo) },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async changeProfile(
    @Param('userId', ParseUUIDPipe) userId: Uuid,
    @Body() dto: ChangeProfileDto
  ): Promise<Customer | Contractor> {
    const userModel = await this.usersService.changeProfile(dto, userId);
    return mapToUserByRole(userModel);
  }
}
