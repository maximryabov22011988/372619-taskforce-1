import { Specialization } from '@project/libs/shared-types';

export class ChangeProfileDto {
  public firstname?: string;

  public lastname?: string;

  public birthDate?: string;

  public info?: string;

  public specialization?: Specialization[];
}
