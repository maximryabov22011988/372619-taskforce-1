import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as makeUuid } from 'uuid';
import { DateTimeService } from '@project/services';
import { Tokens } from '@project/libs/shared-types';
import { UserModel } from '../../database/models/user.model';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/users.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateTokensDto } from './dto/update-tokens.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
    private readonly dateTimeService: DateTimeService
  ) {}

  public async register(dto: RegisterUserDto): Promise<void> {
    const userModel = await this.usersRepository.findByEmail(dto.email);
    if (userModel) {
      throw new ConflictException('User already exists');
    }

    const userEntity = await new UserEntity({
      id: makeUuid(),
      firstname: dto.firstname,
      lastname: dto.lastname,
      email: dto.email,
      cityId: 1,
      roleId: 1,
      avatarUrl: dto.avatarUrl,
      birthDate: this.dateTimeService.formatDate(
        dto.birthDate,
        DateTimeService.DATE_FORMAT
      ),
      info: '',
      specializations: [],
    }).setPassword(dto.password);

    await this.usersRepository.create(userEntity);
  }

  public async verifyUser(dto: LoginUserDto): Promise<UserModel> {
    const { email, password } = dto;
    const userModel = await this.usersRepository.findByEmail(email);
    if (userModel === null) {
      throw new NotFoundException('User was not found');
    }

    const userEntity = new UserEntity({
      ...userModel,
      specializations: [],
    });
    if (!(await userEntity.comparePassword(password))) {
      throw new UnauthorizedException('Incorrect login or password');
    }

    // должен возвращать accessToken
    return userModel;
  }

  public async changePassword(
    dto: ChangePasswordDto,
    userId: string
  ): Promise<UserModel> {
    const { oldPassword, newPassword } = dto;
    const userModel = await this.usersService.findById(userId);

    await this.verifyUser({
      email: userModel.email,
      password: oldPassword,
    });

    const userEntity = await new UserEntity({
      ...userModel,
      specializations: [],
    }).setPassword(newPassword);

    return this.usersRepository.update(userId, userEntity);
  }

  public async logout(dto: LogoutUserDto): Promise<void> {}

  public async updateTokens(dto: UpdateTokensDto): Promise<Tokens> {
    return { accessToken: '', refreshToken: '' };
  }
}
