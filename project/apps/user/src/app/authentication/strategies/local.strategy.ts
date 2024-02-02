import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { RequestWithUser } from '@project/libs/shared-types';
import { AuthenticationService } from '../authentication.service';

const USERNAME_FIELD_NAME = 'email';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthenticationService) {
    super({ usernameField: USERNAME_FIELD_NAME });
  }

  public async validate(
    email: string,
    password: string
  ): Promise<RequestWithUser['user']> {
    const isVerified = await this.authService.verifyUser({
      email,
      password,
    });

    if (isVerified) {
      const userModel = await this.authService.getUserByEmail(email);
      return {
        id: userModel.id,
        firstname: userModel.firstname,
        lastname: userModel.lastname,
        email: userModel.email,
        roleId: userModel.roleId,
      };
    }
  }
}
