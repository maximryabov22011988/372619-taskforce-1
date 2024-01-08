import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

const JWT_ALGORITHM = 'HS256';

export const getJwtOptions = async (
  configService: ConfigService
): Promise<JwtModuleOptions> => ({
  secret: configService.get<string>('jwt.accessTokenSecret'),
  signOptions: {
    expiresIn: configService.get<string>('jwt.accessTokenExpiresIn'),
    algorithm: JWT_ALGORITHM,
  },
});
