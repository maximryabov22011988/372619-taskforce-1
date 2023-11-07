import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { User } from '@project/libs/shared-types';
import { UserEntity } from './users.entity';
import { UserRepository } from './users.repository';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeProfileDto } from './dto/change-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthenticationService
  ) {}

  public async findById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User was not found');
    }

    return user;
  }

  public async changePassword(dto: ChangePasswordDto, userId: string) {
    const { oldPassword, newPassword } = dto;
    const user = await this.findById(userId);

    await this.authService.verifyUser({
      email: user.email,
      password: oldPassword,
    });

    const userEntity = await new UserEntity({
      ...user,
    }).setPassword(newPassword);

    return this.userRepository.update(userId, userEntity.toObject());
  }

  public async changeProfile(dto: ChangeProfileDto, userId: string) {
    const { firstname, lastname, specialization, birthDate, info } = dto;
    const { id, createdAt, email, city, role, passwordHash } =
      await this.findById(userId);

    return this.userRepository.update(userId, {
      id,
      firstname,
      lastname,
      email,
      passwordHash,
      role,
      city,
      specialization,
      birthDate,
      info,
      createdAt,
    });
  }
}
