import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TicketEntity {
  @Field()
  id: bigint;

  @Field({ nullable: true })
  title: string;

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field(() => [TicketMessageEntity], { nullable: true })
  messages: TicketMessageEntity[];
}

@ObjectType()
export class TicketMessageEntity {
  @Field()
  id: bigint;

  @Field()
  message: string;

  @Field()
  senderId: bigint;
}
