import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRoleId } from '@project/libs/shared-types';

export class TokenPayloadRdo {
  @ApiProperty({
    description: "User's id",
    example: '4ff6e921-36c4-4f80-ae41-919c06c0c5c3',
  })
  @Expose()
  public sub: string;

  @ApiProperty({
    description: "User's first name",
    example: 'John',
  })
  @Expose()
  public firstname: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  @Expose()
  public lastname: string;

  @ApiProperty({
    description: "User's unique email address",
    example: 'john.doe@yahoo.com',
  })
  @Expose()
  public email: string;

  @ApiProperty({
    description: "User's role id",
    enum: UserRoleId,
    example: UserRoleId.Customer,
  })
  @Expose()
  public roleId: UserRoleId;

  @ApiProperty({
    description: 'Access token creation time',
    type: Number,
    example: 1705512091,
  })
  @Expose()
  public iat: number;

  @ApiProperty({
    description: 'Access token expiration date',
    type: Number,
    example: 1705512091,
  })
  @Expose()
  public exp: number;
}
