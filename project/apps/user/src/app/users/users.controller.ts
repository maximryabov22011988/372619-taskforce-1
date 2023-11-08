import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Patch,
  Body,
} from '@nestjs/common';
import { User, UserRole } from '@project/libs/shared-types';
import { fillObject } from '@project/libs/utils-core';
import { UsersService } from './users.service';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { ContractorUserRdo } from './rdo/contractor-user.rdo';
import { CustomerUserRdo } from './rdo/customer-user.rdo';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  public async getUser(
    @Param('userId') userId: string
  ): Promise<ContractorUserRdo | CustomerUserRdo> {
    const user = await this.usersService.findById(userId);
    return this.getUserDataByRole(user);
  }

  @Patch(':userId/profile')
  public async changeProfile(
    @Param('userId') userId: string,
    @Body() dto: ChangeProfileDto
  ): Promise<ContractorUserRdo | CustomerUserRdo> {
    const user = await this.usersService.changeProfile(dto, userId);
    return this.getUserDataByRole(user);
  }

  private getUserDataByRole(user: User) {
    if (user.role === UserRole.Customer) {
      return fillObject(CustomerUserRdo, user);
    }

    if (user.role === UserRole.Contractor) {
      return fillObject(ContractorUserRdo, user);
    }

    throw new HttpException(
      `User with id "${user.id}" has invalid role${
        user.role ? ` - ${user.role}` : ''
      }`,
      HttpStatus.BAD_REQUEST
    );
  }
}
