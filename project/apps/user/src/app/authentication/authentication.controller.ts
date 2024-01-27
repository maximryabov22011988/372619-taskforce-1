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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillObject } from '@project/libs/utils-core';
import {
  RequestWithTokenPayload,
  User,
  Uuid,
} from '@project/libs/shared-types';
import { JwtAuthGuard } from '@project/libs/validators';
import { ChangePasswordDto, RegisterUserDto } from '@project/libs/dto';
import { LoggedUserRdo, RegisteredUserRdo } from '@project/libs/rdo';
import { RequestWithUser } from '@project/libs/shared-types';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthenticationService } from './authentication.service';
import { TokenPayloadRdo } from './rdo/token-payload.rdo';

@ApiTags('Authentication service')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registration new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New user has been successfully created',
    type: RegisteredUserRdo,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User has already exists',
  })
  public async register(@Body() dto: RegisterUserDto): Promise<User> {
    const userModel = await this.authService.register(dto);
    return fillObject(RegisteredUserRdo, userModel);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
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
    description: 'User has been logged in successfully',
    type: LoggedUserRdo,
  })
  public async login(@Req() { user }: RequestWithUser): Promise<LoggedUserRdo> {
    const userModel = await this.authService.getUserByEmail(user.email);
    const token = await this.authService.createUserToken({
      ...userModel,
    });

    return fillObject(LoggedUserRdo, token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('check')
  @ApiOperation({ summary: 'Getting user information' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Getting user information',
    type: TokenPayloadRdo,
  })
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload) {
    return payload;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'New access/refresh token successfully received',
    type: LoggedUserRdo,
  })
  public async refreshToken(@Req() { user }: RequestWithUser) {
    return this.authService.createUserToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Password has been changed successfully',
  })
  public async changePassword(
    @Param('userId', ParseUUIDPipe) userId: Uuid,
    @Body() dto: ChangePasswordDto
  ): Promise<void> {
    await this.authService.changePassword(dto, userId);
  }
}
