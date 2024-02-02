import { Inject, Injectable } from '@nestjs/common';
import { RoleModel } from '../../../src/database/models/role.model';

@Injectable()
export class RolesRepository {
  constructor(
    @Inject(RoleModel) private readonly roleModel: typeof RoleModel
  ) {}

  public async findById(id: number): Promise<RoleModel> {
    return this.roleModel.query().where({ id }).returning('*').first();
  }

  public async findAll(): Promise<RoleModel[]> {
    return this.roleModel.query().select('*').execute();
  }
}
