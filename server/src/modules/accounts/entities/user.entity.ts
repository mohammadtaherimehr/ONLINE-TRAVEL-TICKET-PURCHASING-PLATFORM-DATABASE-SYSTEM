import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

@ObjectType()
export class UserEntity {
  @Field()
  id: bigint;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  phoneNumber: string;

  @Field()
  role: UserRole;

  @Field({ nullable: true })
  jwtToken?: string;
}
