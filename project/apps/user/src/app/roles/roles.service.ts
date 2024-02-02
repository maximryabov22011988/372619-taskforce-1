import { Injectable, NotFoundException } from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { RoleModel } from '../../database/models/role.model';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  public async findById(id: number): Promise<RoleModel> {
    const roleModel = await this.rolesRepository.findById(id);
    if (!roleModel) {
      throw new NotFoundException('Role was not found');
    }

    return roleModel;
  }

  public async findAll(): Promise<RoleModel[]> {
    return this.rolesRepository.findAll();
  }
}
