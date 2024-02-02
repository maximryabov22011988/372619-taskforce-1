import { Injectable, ConflictException } from '@nestjs/common';
import { CreateCategoryDto } from '@project/libs/dto';
import { CategoryModel } from '../../database/models/category.model';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  public async getCategory(name: string): Promise<CategoryModel> {
    return this.categoriesRepository.findByName(name);
  }

  public async createCategory(
    dto: CreateCategoryDto
  ): Promise<CategoryModel | null> {
    const categoryModel = await this.getCategory(dto.name);
    if (categoryModel) {
      throw new ConflictException('Category already exists');
    }

    return this.categoriesRepository.create(dto);
  }
}
