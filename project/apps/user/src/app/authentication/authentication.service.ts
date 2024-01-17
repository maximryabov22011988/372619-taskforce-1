import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as makeUuid } from 'uuid';
import { DateTimeService } from '@project/libs/services';
import { Tokens, AccessTokenPayload } from '@project/libs/shared-types';
import { UserModel } from '../../database/models/user.model';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/users.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
      cityId: dto.cityId,
      roleId: dto.roleId,
      birthDate: this.dateTimeService.formatDate(
        dto.birthDate,
        DateTimeService.DATE_FORMAT
      ),
      avatarUrl: dto.avatarUrl ?? '',
      info: '',
      specializations: [],
    }).setPassword(dto.password);

    await this.usersRepository.create(userEntity);
  }

  public async verifyUser(dto: LoginUserDto): Promise<boolean> {
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

    return true;
  }

  public async getUserByEmail(email: string): Promise<UserModel> {
    return this.usersRepository.findByEmail(email);
  }

  public async changePassword(
    dto: ChangePasswordDto,
    userId: string
  ): Promise<UserModel> {
    const { oldPassword, newPassword } = dto;
    const userModel = await this.usersService.findById(userId);

    const isVerified = await this.verifyUser({
      email: userModel.email,
      password: oldPassword,
    });

    if (isVerified) {
      const userEntity = await new UserEntity({
        firstname: userModel.firstname,
        lastname: userModel.lastname,
        birthDate: this.dateTimeService.formatDate(
          userModel.birthDate,
          DateTimeService.DATE_FORMAT
        ),
        info: userModel.info,
        specializations: [],
        cityId: userModel.cityId,
        email: userModel.email,
        roleId: userModel.roleId,
        avatarUrl: userModel.avatarUrl,
      }).setPassword(newPassword);

      return this.usersRepository.update(userId, userEntity);
    }

    return userModel;
  }

  public async createUserToken(
    userModel: UserModel
  ): Promise<Pick<Tokens, 'accessToken'>> {
    const payload: AccessTokenPayload = {
      sub: userModel.id,
      email: userModel.email,
      roleId: userModel.roleId,
      lastname: userModel.lastname,
      firstname: userModel.firstname,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
