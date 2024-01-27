import { AccessTokenPayload } from './access-token-payload.interface';

export interface RequestWithTokenPayload {
  user?: AccessTokenPayload;
}
