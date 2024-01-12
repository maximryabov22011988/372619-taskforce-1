import { Injectable, NotFoundException } from '@nestjs/common';
import { UserModel } from '../../database/models/user.model';
import { UsersRepository } from './users.repository';
import { UserEntity } from './users.entity';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { DateTimeService } from '@project/libs/services';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly dateTimeService: DateTimeService
  ) {}

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
      firstname: dto.firstname ?? userModel.firstname,
      lastname: dto.lastname ?? userModel.lastname,
      birthDate: this.dateTimeService.formatDate(
        dto.birthDate ?? userModel.birthDate,
        DateTimeService.DATE_FORMAT
      ),
      info: dto.info ?? '',
      specializations: dto.specializations ?? [],
      cityId: dto.cityId ?? userModel.cityId,
      email: userModel.email,
      roleId: userModel.roleId,
      avatarUrl: userModel.avatarUrl,
    });

    return this.usersRepository.update(userId, userEntity);
  }
}
