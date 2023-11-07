import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DateTimeService } from '@project/services';
import { User, Tokens } from '@project/libs/shared-types';
import { UserRepository } from '../users/users.repository';
import { UserEntity } from '../users/users.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
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

    const isUserExists = await this.userRepository.findByEmail(email);
    if (isUserExists) {
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
    const isUserExists = await this.userRepository.findByEmail(email);
    if (!isUserExists) {
      throw new NotFoundException('User was not found');
    }

    const userEntity = new UserEntity(isUserExists);
    if (!(await userEntity.comparePassword(password))) {
      throw new UnauthorizedException('Incorrect login or password');
    }

    return userEntity.toObject();
  }

  public async logout(dto: LogoutUserDto): Promise<void> {}

  public async refreshToken(dto: RefreshTokenDto): Promise<Tokens> {
    return { accessToken: '', refreshToken: '' };
  }
}
