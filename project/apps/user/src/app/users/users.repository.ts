import { Inject, Injectable } from '@nestjs/common';
import { CRUDRepository } from '@project/libs/utils-types';
import { UserRoleId } from '@project/libs/shared-types';
import { UserModel } from '../../database/models/user.model';
import { UserEntity } from './users.entity';

@Injectable()
export class UsersRepository
  implements CRUDRepository<UserEntity, string, UserModel>
{
  constructor(
    @Inject(UserModel) private readonly userModel: typeof UserModel
  ) {}

  public async findByRole(roleId: UserRoleId): Promise<UserModel[]> {
    return this.userModel.query().where({ roleId }).returning('*').execute();
  }

  public async findById(id: string): Promise<UserModel> {
    return this.userModel
      .query()
      .where({ id })
      .withGraphFetched('role')
      .withGraphFetched('specializations')
      .returning('*')
      .first();
  }

  public async findByEmail(email: string): Promise<UserModel> {
    return this.userModel
      .query()
      .where({ email })
      .withGraphFetched('role')
      .withGraphFetched('specializations')
      .returning('*')
      .first();
  }

  public async create(item: UserEntity): Promise<UserModel> {
    return this.userModel
      .query()
      .insert(item.toObject())
      .withGraphFetched('role')
      .returning('*');
  }

  public async update(id: string, item: UserEntity): Promise<UserModel> {
    return this.userModel
      .query()
      .patchAndFetchById(id, item.toObject())
      .withGraphFetched('role')
      .withGraphFetched('specializations')
      .returning('*');
  }

  public async delete(id: string): Promise<void> {
    await this.userModel.query().where({ id }).delete();
  }
}
