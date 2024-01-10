import {
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillObject } from '@project/libs/utils-core';
import { Uuid } from '@project/libs/shared-types';
import { JwtAuthGuard } from '@project/libs/validators';
import { NotifyService } from '../notify/notify.service';
import { AuthenticationService } from './authentication.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateTokensDto } from './dto/update-tokens.dto';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { UpdatedTokensRdo } from './rdo/updated-tokens.rdo';

@ApiTags('Authentication service')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly notifyService: NotifyService
  ) {}

  @Post('/register')
  @ApiOperation({ summary: 'Registration new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New user has been successfully created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User has already exists',
  })
  public async register(@Body() dto: RegisterUserDto): Promise<void> {
    const newUserModel = await this.authService.register(dto);

    const { email, firstname, lastname } = newUserModel;
    await this.notifyService.registerSubscriber({ email, firstname, lastname });
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been logged in successfully',
    type: LoggedUserRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async login(@Body() dto: LoginUserDto): Promise<LoggedUserRdo> {
    const userModel = await this.authService.verifyUser(dto);
    const token = await this.authService.createUserToken(userModel);

    return fillObject(LoggedUserRdo, token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User has been logged out',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async logout(@Body() dto: LogoutUserDto): Promise<void> {
    await this.authService.logout(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update tokens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tokens has been updated successfully',
    type: UpdatedTokensRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async updateTokens(
    @Body() dto: UpdateTokensDto
  ): Promise<UpdatedTokensRdo> {
    const tokens = await this.authService.updateTokens(dto);
    return fillObject(UpdatedTokensRdo, tokens);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/password/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Password has been changed successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async changePassword(
    @Param('userId', ParseUUIDPipe) userId: Uuid,
    @Body() dto: ChangePasswordDto
  ): Promise<void> {
    await this.authService.changePassword(dto, userId);
  }
}
