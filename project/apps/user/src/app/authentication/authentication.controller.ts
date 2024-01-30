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
  Req,
  Get,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { fillObject } from '@project/libs/utils-core';
import {
  RequestWithTokenPayload,
  User,
  Uuid,
} from '@project/libs/shared-types';
import { JwtAuthGuard } from '@project/libs/validators';
import {
  ChangePasswordDto,
  LoginUserDto,
  RegisterUserDto,
} from '@project/libs/dto';
import { ApiAuth } from '@project/libs/decorators';
import { LoggedUserRdo, RegisteredUserRdo } from '@project/libs/rdo';
import { RequestWithUser } from '@project/libs/shared-types';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthenticationService } from './authentication.service';
import { TokenPayloadRdo } from './rdo/token-payload.rdo';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('Authentication service')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registration new user' })
  @ApiCreatedResponse({
    description: 'New user has been successfully created',
    type: RegisteredUserRdo,
  })
  @ApiConflictResponse({ description: 'User already exists' })
  public async register(@Body() dto: RegisterUserDto): Promise<User> {
    const userModel = await this.authService.register(dto);
    return fillObject(RegisteredUserRdo, userModel);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({
    description: 'User has been logged in successfully',
    type: LoggedUserRdo,
  })
  @ApiUnauthorizedResponse({ description: 'Incorrect login or password' })
  public async login(@Body() dto: LoginUserDto): Promise<LoggedUserRdo> {
    const userModel = await this.authService.getUserByEmail(dto.email);
    const token = await this.authService.createUserToken({
      ...userModel,
    });

    return fillObject(LoggedUserRdo, token);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiAuth()
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiOkResponse({
    description: 'New access/refresh token successfully received',
    type: LoggedUserRdo,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async refreshToken(
    @Req() { user }: RequestWithUser
  ): Promise<LoggedUserRdo> {
    return this.authService.createUserToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiAuth()
  @ApiOperation({ summary: 'Change password' })
  @ApiParam({
    name: 'userId',
    type: String,
    format: 'UUID',
  })
  @ApiNoContentResponse({
    description: 'Password has been changed successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'User was not found' })
  public async changePassword(
    @Param('userId', ParseUUIDPipe) userId: Uuid,
    @Body() dto: ChangePasswordDto
  ): Promise<void> {
    await this.authService.changePassword(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check')
  @ApiOperation({ summary: 'Getting user information from auth header' })
  @ApiAuth()
  @ApiOkResponse({
    description: 'User information successfully received',
    type: TokenPayloadRdo,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async checkToken(
    @Req() { user: payload }: RequestWithTokenPayload
  ): Promise<TokenPayloadRdo> {
    return payload;
  }
}
