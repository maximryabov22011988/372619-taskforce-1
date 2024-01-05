import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Patch,
  Body,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiExtraModels,
  refs,
} from '@nestjs/swagger';
import { Contractor, Customer } from '@project/libs/shared-types';
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
  public async getUser(
    @Param('userId') userId: string
  ): Promise<Customer | Contractor> {
    const userModel = await this.usersService.findById(userId);
    return mapToUserByRole(userModel);
  }

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
  public async changeProfile(
    @Param('userId') userId: string,
    @Body() dto: ChangeProfileDto
  ): Promise<Customer | Contractor> {
    const userModel = await this.usersService.changeProfile(dto, userId);
    return mapToUserByRole(userModel);
  }
}
