import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Category, UserRoleId } from '@project/libs/shared-types';
import { CreateCategoryDto } from '@project/libs/dto';
import { CategoryRdo } from '@project/libs/rdo';
import { JwtAuthGuard, Roles, RolesGuard } from '@project/libs/validators';
import { CategoriesService } from './categories.service';
import { mapToCategory } from './category-mapper';

@Controller({
  path: 'categories',
  version: '1',
})
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(UserRoleId.Customer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Creating new category' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New category has been successfully created',
    type: CategoryRdo,
  })
  public async createCategory(
    @Body() dto: CreateCategoryDto
  ): Promise<Category> {
    const categoryModel = await this.categoriesService.createCategory(dto);
    return mapToCategory(categoryModel);
  }
}
