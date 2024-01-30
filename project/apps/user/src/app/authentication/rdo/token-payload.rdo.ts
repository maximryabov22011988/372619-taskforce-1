import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRoleId } from '@project/libs/shared-types';
import { BaseUserRdo } from '@project/libs/rdo';

export class TokenPayloadRdo extends PickType(BaseUserRdo, [
  'firstname',
  'lastname',
  'email',
] as const) {
  @ApiProperty({
    description: "User's id",
    example: '4ff6e921-36c4-4f80-ae41-919c06c0c5c3',
  })
  @Expose()
  public sub: string;

  @ApiProperty({
    description: "User's role id",
    enum: UserRoleId,
    example: UserRoleId.Customer,
  })
  @Expose()
  public roleId: UserRoleId;
}
