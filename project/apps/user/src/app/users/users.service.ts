import { Injectable, NotFoundException } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { UserRoleId } from '@project/libs/shared-types';
import { ChangeProfileDto } from '@project/libs/dto';
import { DateTimeService } from '@project/libs/services';
import { UserModel } from '../../database/models/user.model';
import { SpecializationsService } from '../specializations/specializations.service';
import { UsersRepository } from './users.repository';
import { UserEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly specializationsService: SpecializationsService,
    private readonly dateTimeService: DateTimeService
  ) {}

  public async findByRole(roleId: UserRoleId): Promise<UserModel[]> {
    return this.usersRepository.findByRole(roleId);
  }

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
      cityId: dto.cityId ?? userModel.cityId,
      email: userModel.email,
      roleId: userModel.roleId,
      avatarUrl: userModel.avatarUrl,
    });

    const existedSpecializations =
      await this.specializationsService.findAllSpecializationsByUser(
        userModel.id
      );
    if (!existedSpecializations.length) {
      await this.specializationsService.createSpecializations(
        dto.specializations,
        userModel.id
      );
    }

    await this.specializationsService.updateSpecializations(
      dto.specializations,
      userModel.id
    );

    return this.usersRepository.update(userId, userEntity);
  }
}
