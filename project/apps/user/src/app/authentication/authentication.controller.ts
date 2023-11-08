import {
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
} from '@nestjs/common';
import { fillObject } from '@project/libs/utils-core';
import { AuthenticationService } from './authentication.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateTokensDto } from './dto/update-tokens.dto';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { UpdatedTokensRdo } from './rdo/updated-tokens.rdo';

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

  @Patch('/password/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async changePassword(
    @Param('userId') userId: string,
    @Body() dto: ChangePasswordDto
  ): Promise<void> {
    await this.authService.changePassword(dto, userId);
  }

  @Post('/tokens')
  @HttpCode(HttpStatus.OK)
  public async updateTokens(
    @Body() dto: UpdateTokensDto
  ): Promise<UpdatedTokensRdo> {
    const tokens = await this.authService.updateTokens(dto);
    return fillObject(UpdatedTokensRdo, tokens);
  }
}
