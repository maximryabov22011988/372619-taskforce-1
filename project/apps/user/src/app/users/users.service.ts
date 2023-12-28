import { Injectable, NotFoundException } from '@nestjs/common';
import { UserModel } from '../../database/models/user.model';
import { UsersRepository } from './users.repository';
import { UserEntity } from './users.entity';
import { ChangeProfileDto } from './dto/change-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async findById(userId: string): Promise<UserModel> {
    const userModel = await this.usersRepository.findById(userId);
    if (!userModel) {
      throw new NotFoundException('User was not found');
    }

    return userModel;
  }

  public async changeProfile(
    dto: ChangeProfileDto,
    userId: string
  ): Promise<UserModel> {
    const userModel = await this.findById(userId);

    const userEntity = new UserEntity({
      firstname: dto.firstname,
      lastname: dto.lastname,
      birthDate: dto.birthDate,
      info: dto.info,
      cityId: 2,
      specializations: [],
      email: userModel.email,
      avatarUrl: userModel.avatarUrl ?? '',
      roleId: 1,
    });

    return this.usersRepository.update(userId, userEntity);
  }
}
