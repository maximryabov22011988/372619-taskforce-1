import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Category, UserRoleId } from '@project/libs/shared-types';
import { CreateCategoryDto } from '@project/libs/dto';
import { CategoryRdo } from '@project/libs/rdo';
import { JwtAuthGuard, Roles, RolesGuard } from '@project/libs/validators';
import { CategoriesService } from './categories.service';
import { mapToCategory } from './category-mapper';
import { ApiAuth } from '@project/libs/decorators';

@Controller({
  path: 'categories',
  version: '1',
})
@ApiTags('Task service')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(UserRoleId.Customer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @ApiAuth()
  @ApiOperation({ summary: 'Creating new category' })
  @ApiCreatedResponse({
    description: 'New category has been successfully created',
    type: CategoryRdo,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public async createCategory(
    @Body() dto: CreateCategoryDto
  ): Promise<Category> {
    const categoryModel = await this.categoriesService.createCategory(dto);
    return mapToCategory(categoryModel);
  }
}
