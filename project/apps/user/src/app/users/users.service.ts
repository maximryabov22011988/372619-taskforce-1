import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@project/libs/shared-types';
import { UsersRepository } from './users.repository';
import { ChangeProfileDto } from './dto/change-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async findById(userId: string): Promise<User> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User was not found');
    }

    return user;
  }

  public async changeProfile(dto: ChangeProfileDto, userId: string) {
    const { firstname, lastname, specialization, birthDate, info } = dto;
    const { id, createdAt, email, city, role, passwordHash } =
      await this.findById(userId);

    return this.usersRepository.update(userId, {
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
