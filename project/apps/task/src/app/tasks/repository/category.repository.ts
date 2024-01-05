import { Inject, Injectable } from '@nestjs/common';
import {
  CategoryModel,
  CategoryModelProperties,
} from '../../../database/models/category.model';

@Injectable()
export class CategoriesRepository {
  constructor(
    @Inject(CategoryModel) private readonly categoryModel: typeof CategoryModel
  ) {}

  public async findByName(name: string): Promise<CategoryModel> {
    return this.categoryModel.query().where({ name }).returning('*').first();
  }

  public async create(
    categoryData: CategoryModelProperties
  ): Promise<CategoryModel> {
    return this.categoryModel.query().insert(categoryData).returning('*');
  }
}
