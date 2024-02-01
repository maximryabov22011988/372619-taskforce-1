import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiParam,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { BffConfig } from '@project/libs/config';
import {
  ChangePasswordDto,
  LoginUserDto,
  RegisterUserDto,
} from '@project/libs/dto';
import { User, Uuid } from '@project/libs/shared-types';
import { LoggedUserRdo, RegisteredUserRdo } from '@project/libs/rdo';
import { TransformCityInterceptor } from '../../interceptors/transform-city.interceptor';
import { CheckAuthGuard } from '../../guards/check-auth.guard';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { ApiAuth } from '@project/libs/decorators';

const { microserviceConfig } = BffConfig;

@UseFilters(HttpExceptionFilter)
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  private readonly baseAuthUrl: string;
  private readonly baseCitiesUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(microserviceConfig.KEY)
    private readonly serviceConfig: ConfigType<typeof microserviceConfig>
  ) {
    const { userServiceUrl, taskServiceUrl } = this.serviceConfig;
    this.baseAuthUrl = `${userServiceUrl}/v1/auth`;
    this.baseCitiesUrl = `${taskServiceUrl}/v1/cities`;
  }

  @UseInterceptors(TransformCityInterceptor)
  @Post('register')
  @ApiOperation({ summary: 'Registration new user' })
  @ApiCreatedResponse({
    description: 'New user has been successfully created',
    type: RegisteredUserRdo,
  })
  @ApiNotFoundResponse({ description: 'City not found' })
  @ApiConflictResponse({ description: 'User already exists' })
  public async register(@Body() dto: RegisterUserDto): Promise<User> {
    await this.httpService.axiosRef.get(`${this.baseCitiesUrl}/${dto.cityId}`);

    const { data } = await this.httpService.axiosRef.post(
      `${this.baseAuthUrl}/register`,
      dto
    );

    return data;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({
    description: 'User has been logged in successfully',
    type: LoggedUserRdo,
  })
  @ApiUnauthorizedResponse({ description: 'Incorrect login or password' })
  public async login(@Body() dto: LoginUserDto): Promise<LoggedUserRdo> {
    const { data } = await this.httpService.axiosRef.post(
      `${this.baseAuthUrl}/login`,
      dto
    );

    return data;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiAuth()
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiOkResponse({
    description: 'New access/refresh token successfully received',
    type: LoggedUserRdo,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async refresh(@Req() req: Request): Promise<LoggedUserRdo> {
    const { data } = await this.httpService.axiosRef.post(
      `${this.baseAuthUrl}/refresh`,
      null,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Patch('password/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Change password' })
  @ApiAuth()
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
    @Body() dto: ChangePasswordDto,
    @Req() req: Request
  ): Promise<void> {
    await this.httpService.axiosRef.patch(
      `${this.baseAuthUrl}/password/${userId}`,
      dto,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
  }
}
