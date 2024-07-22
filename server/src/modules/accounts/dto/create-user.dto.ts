import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @Field()
  phoneNumber?: string;

  @Field()
  email?: string;

  @Field()
  name: string;

  @Field()
  role: string;

  @Field()
  password: string;
}
