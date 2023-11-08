import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DateTimeService } from '@project/services';
import { User, Tokens } from '@project/libs/shared-types';
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
    private readonly userRepository: UsersRepository,
    private readonly usersService: UsersService,
    private readonly dateTime: DateTimeService
  ) {}

  public async register(dto: RegisterUserDto): Promise<void> {
    const {
      firstname,
      lastname,
      email,
      city,
      role,
      birthDate,
      password,
      avatar,
    } = dto;

    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new ConflictException('User already exists');
    }

    const userEntity = await new UserEntity({
      firstname,
      lastname,
      email,
      city,
      role,
      avatar,
      birthDate: this.dateTime.getDateTimeLocale(
        DateTimeService.UTC_FORMAT,
        birthDate
      ),
      createdAt: this.dateTime.getDateTimeLocale(DateTimeService.UTC_FORMAT),
    }).setPassword(password);

    await this.userRepository.create(userEntity.toObject());
  }

  public async verifyUser(dto: LoginUserDto): Promise<User> {
    const { email, password } = dto;
    const user = await this.userRepository.findByEmail(email);
    if (user === null) {
      throw new NotFoundException('User was not found');
    }

    const userEntity = new UserEntity(user);
    if (!(await userEntity.comparePassword(password))) {
      throw new UnauthorizedException('Incorrect login or password');
    }

    return userEntity.toObject();
  }

  public async changePassword(dto: ChangePasswordDto, userId: string) {
    const { oldPassword, newPassword } = dto;
    const user = await this.usersService.findById(userId);

    await this.verifyUser({
      email: user.email,
      password: oldPassword,
    });

    const userEntity = await new UserEntity({
      ...user,
    }).setPassword(newPassword);

    return this.userRepository.update(userId, userEntity.toObject());
  }

  public async logout(dto: LogoutUserDto): Promise<void> {}

  public async updateTokens(dto: UpdateTokensDto): Promise<Tokens> {
    return { accessToken: '', refreshToken: '' };
  }
}
