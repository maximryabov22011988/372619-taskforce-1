import { Controller, Body, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { fillObject } from '@project/libs/utils-core';
import { AuthenticationService } from './authentication.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { RefreshTokenRdo } from './rdo/refresh-token.rdo';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('/register')
  public async register(@Body() dto: RegisterUserDto): Promise<void> {
    await this.authService.register(dto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() dto: LoginUserDto): Promise<LoggedUserRdo> {
    const user = await this.authService.verifyUser(dto);
    return fillObject(LoggedUserRdo, user);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Body() dto: LogoutUserDto): Promise<void> {
    await this.authService.logout(dto);
  }

  @Post('/token')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(
    @Body() dto: RefreshTokenDto
  ): Promise<RefreshTokenRdo> {
    const tokens = await this.authService.refreshToken(dto);
    return fillObject(RefreshTokenRdo, tokens);
  }
}
