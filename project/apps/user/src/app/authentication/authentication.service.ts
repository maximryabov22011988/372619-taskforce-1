import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { v4 as makeUuid } from 'uuid';
import { createJWTPayload } from '@project/libs/utils-core';
import { UserConfig } from '@project/libs/config';
import { DateTimeService } from '@project/libs/services';
import { Tokens, AccessTokenPayload, Uuid } from '@project/libs/shared-types';
import { RegisterUserDto } from '@project/libs/dto';
import { LoginUserDto } from '@project/libs/dto';
import { ChangePasswordDto } from '@project/libs/dto';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import {
  UserModel,
  UserModelProperties,
} from '../../database/models/user.model';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/users.entity';

const { jwtConfig } = UserConfig;

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly dateTimeService: DateTimeService,

    @Inject(jwtConfig.KEY)
    private readonly jwtOptions: ConfigType<typeof jwtConfig>
  ) {}

  public async register(dto: RegisterUserDto): Promise<UserModel> {
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
    }).setPassword(dto.password);

    return this.usersRepository.create(userEntity);
  }

  public async verifyUser(dto: LoginUserDto): Promise<boolean> {
    const { email, password } = dto;
    const userModel = await this.usersRepository.findByEmail(email);
    if (userModel === null) {
      throw new NotFoundException('User was not found');
    }

    const userEntity = new UserEntity({
      ...userModel,
    });
    if (!(await userEntity.comparePassword(password))) {
      throw new UnauthorizedException('Incorrect login or password');
    }

    return true;
  }

  public async getUserByEmail(email: string): Promise<UserModel> {
    return this.usersRepository.findByEmail(email);
  }

  public async getUserById(id: Uuid): Promise<UserModel> {
    return this.usersRepository.findById(id);
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
    userData: Pick<
      UserModelProperties,
      'id' | 'email' | 'roleId' | 'firstname' | 'lastname'
    >
  ): Promise<Tokens> {
    const accessTokenPayload = createJWTPayload(userData);

    const refreshTokenPayload = {
      ...accessTokenPayload,
      tokenId: makeUuid(),
    };
    await this.refreshTokenService.createRefreshSession(refreshTokenPayload);

    return {
      accessToken: await this.jwtService.signAsync(accessTokenPayload),
      refreshToken: await this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.jwtOptions.refreshTokenSecret,
        expiresIn: this.jwtOptions.refreshTokenExpiresIn,
      }),
    };
  }
}
