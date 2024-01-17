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
import { AuthenticationService } from './authentication.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoggedUserRdo } from './rdo/logged-user.rdo';

@ApiTags('Authentication service')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

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
    await this.authService.register(dto);
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
  public async login(
    @Body() dto: LoginUserDto
  ): Promise<LoggedUserRdo | object> {
    const isVerified = await this.authService.verifyUser(dto);
    if (isVerified) {
      const userModel = await this.authService.getUserByEmail(dto.email);
      const token = await this.authService.createUserToken(userModel);

      return fillObject(LoggedUserRdo, token);
    }

    return {};
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
