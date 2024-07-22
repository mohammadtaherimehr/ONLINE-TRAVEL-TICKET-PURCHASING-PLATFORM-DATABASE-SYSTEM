import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TicketReservationEntity } from './ticket-reservation.entity';

@ObjectType()
export class TravelEntity {
  @Field()
  id: bigint;

  @Field()
  originName: string;

  @Field()
  destinationName: string;

  @Field()
  startsAt: string;

  @Field({ nullable: true })
  duration?: string;

  @Field()
  vehicleType: string;

  @Field()
  travelType: string;

  @Field(() => Int)
  capacity: number;

  @Field()
  price: bigint;
}

export class TravelWithSeatsEntity {
  @Field()
  id: bigint;

  @Field()
  originName: string;

  @Field()
  destinationName: string;

  @Field()
  startsAt: string;

  @Field({ nullable: true })
  duration?: string;

  @Field()
  vehicleType: string;

  @Field()
  travelType: string;

  @Field(() => Int)
  capacity: number;

  @Field()
  price: bigint;

  @Field(() => [TicketReservationEntity])
  seats: TicketReservationEntity[];
}
