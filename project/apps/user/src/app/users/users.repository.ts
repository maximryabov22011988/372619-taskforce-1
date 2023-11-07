import { Injectable } from '@nestjs/common';
import { User } from '@project/libs/shared-types';
import { UserEntity } from './users.entity';

import { MemoryRepository } from '@project/services';

@Injectable()
export class UserRepository extends MemoryRepository<
  Omit<
    UserEntity,
    'toObject' | 'fillEntity' | 'comparePassword' | 'setPassword'
  >,
  User
> {
  public async findByEmail(email: string): Promise<User> {
    const foundUser = Object.values(this.repository).find(
      (item) => item.email === email
    );
    if (foundUser) {
      return { ...foundUser };
    }

    return null;
  }
}
