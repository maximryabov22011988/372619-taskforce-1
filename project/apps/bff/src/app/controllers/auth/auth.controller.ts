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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { ApiGatewayConfig } from '@project/libs/config';
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

const { microserviceConfig } = ApiGatewayConfig;

@UseFilters(HttpExceptionFilter)
@Controller('auth')
@ApiTags('User service')
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
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'City not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User has already exists',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New user has been successfully created',
    type: RegisteredUserRdo,
  })
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
  public async login(@Body() dto: LoginUserDto): Promise<LoggedUserRdo> {
    const { data } = await this.httpService.axiosRef.post(
      `${this.baseAuthUrl}/login`,
      dto
    );

    return data;
  }

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
