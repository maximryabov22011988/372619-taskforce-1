import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import FormData from 'form-data';
import { BffConfig } from '@project/libs/config';
import {
  Uuid,
  ImageFile,
  RequestWithTokenPayload,
  CustomerWithStatistics,
  ContractorWithStatistics,
  UserRole,
} from '@project/libs/shared-types';
import { ChangeProfileDto } from '@project/libs/dto';
import { UploadedImageFileRdo } from '@project/libs/rdo';
import { TransformCityInterceptor } from '../../interceptors/transform-city.interceptor';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { CheckAuthGuard } from '../../guards/check-auth.guard';
import { ContractorUserRdo } from './rdo/contractor-user.rdo';
import { CustomerUserRdo } from './rdo/customer-user.rdo';

const { microserviceConfig } = BffConfig;

@UseFilters(HttpExceptionFilter)
@Controller('users')
@ApiTags('User service')
export class UserController {
  private readonly baseUsersUrl: string;
  private readonly baseTasksUrl: string;
  private readonly baseReviewsUrl: string;
  private readonly baseAvatarUploadUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(microserviceConfig.KEY)
    private readonly serviceConfig: ConfigType<typeof microserviceConfig>
  ) {
    const { userServiceUrl, imageServiceUrl, taskServiceUrl } =
      this.serviceConfig;

    this.baseUsersUrl = `${userServiceUrl}/v1/users`;
    this.baseTasksUrl = `${taskServiceUrl}/v1/tasks`;
    this.baseReviewsUrl = `${taskServiceUrl}/v1/reviews`;
    this.baseAvatarUploadUrl = `${imageServiceUrl}/v1/image/upload/avatar`;
  }

  @UseGuards(CheckAuthGuard)
  @Get('/:userId')
  @UseInterceptors(TransformCityInterceptor)
  @ApiOperation({ summary: 'Getting detailed user information' })
  @ApiExtraModels(ContractorUserRdo, CustomerUserRdo)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contractor or customer user information',
    schema: { oneOf: refs(ContractorUserRdo, CustomerUserRdo) },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  public async getUser(
    @Param('userId', ParseUUIDPipe) userId: Uuid,
    @Req() req: Request & RequestWithTokenPayload
  ): Promise<{
    data: CustomerWithStatistics | ContractorWithStatistics;
  }> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.baseUsersUrl}/${userId}`,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    const userStatistics = await this.getUserStatistics(userId, data.role, req);

    return {
      ...data,
      ...userStatistics,
    };
  }

  @UseGuards(CheckAuthGuard)
  @Patch(':userId/profile')
  @UseInterceptors(TransformCityInterceptor)
  @ApiOperation({ summary: 'Change user profile info' })
  @ApiExtraModels(ContractorUserRdo, CustomerUserRdo)
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
    description: 'Updated contractor or customer user information',
    schema: { oneOf: refs(ContractorUserRdo, CustomerUserRdo) },
  })
  public async changeProfile(
    @Param('userId', ParseUUIDPipe) userId: Uuid,
    @Body() dto: ChangeProfileDto,
    @Req() req: Request & RequestWithTokenPayload
  ): Promise<CustomerWithStatistics | ContractorWithStatistics> {
    const { data } = await this.httpService.axiosRef.patch(
      `${this.baseUsersUrl}/${userId}/profile`,
      dto,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    const userStatistics = await this.getUserStatistics(userId, data.role, req);

    return {
      ...data,
      ...userStatistics,
    };
  }

  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Uploading user avatar' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image file is successfully uploaded',
    type: UploadedImageFileRdo,
  })
  @ApiConsumes('multipart/form-data')
  public async uploadAvatar(@UploadedFile() file): Promise<ImageFile> {
    const form = new FormData();
    form.append('file', file.buffer, file.originalname);

    const { data } = await this.httpService.axiosRef.post(
      this.baseAvatarUploadUrl,
      form,
      {
        headers: form.getHeaders(),
      }
    );

    return data;
  }

  private async getUserStatistics(
    userId: Uuid,
    userRole: UserRole,
    req: Request & RequestWithTokenPayload
  ): Promise<object> {
    const config = {
      headers: {
        Authorization: req.headers['authorization'],
      },
    };

    if (userRole === UserRole.Customer) {
      const { data: publishedTaskCount } = await this.httpService.axiosRef.get(
        `${this.baseTasksUrl}/customers/${userId}`,
        config
      );
      const { data: newTaskCount } = await this.httpService.axiosRef.get(
        `${this.baseTasksUrl}/new/customers/${userId}`,
        config
      );

      return {
        publishedTaskCount,
        newTaskCount,
      };
    } else if (userRole === UserRole.Contractor) {
      const { data: doneTaskCount } = await this.httpService.axiosRef.get(
        `${this.baseTasksUrl}/done/contractors/${userId}`,
        config
      );
      const { data: failedTaskCount } = await this.httpService.axiosRef.get(
        `${this.baseTasksUrl}/failed/contractors/${userId}`,
        config
      );
      const { data: rating } = await this.httpService.axiosRef.get(
        `${this.baseReviewsUrl}/contractors/${userId}/rating`,
        {
          headers: {
            Authorization: req.headers['authorization'],
          },
        }
      );
      const { data: ratingLevel } = await this.httpService.axiosRef.get(
        `${this.baseReviewsUrl}/contractors/${userId}/rating-level`,
        {
          headers: {
            Authorization: req.headers['authorization'],
          },
        }
      );

      return {
        doneTaskCount,
        failedTaskCount,
        rating,
        ratingLevel,
      };
    }

    return {};
  }
}
