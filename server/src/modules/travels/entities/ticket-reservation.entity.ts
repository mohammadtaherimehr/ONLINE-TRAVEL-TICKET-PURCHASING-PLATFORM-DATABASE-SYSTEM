import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TicketReservationEntity {
  @Field({ nullable: true })
  isMale?: boolean;

  @Field(() => Int)
  seatPosition: number;
}
