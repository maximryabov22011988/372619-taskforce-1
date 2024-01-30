import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export const ACCESS_TOKEN_NAME = 'accessToken';

export const ApiAuth = (name: string = ACCESS_TOKEN_NAME) =>
  applyDecorators(ApiBearerAuth(name));
