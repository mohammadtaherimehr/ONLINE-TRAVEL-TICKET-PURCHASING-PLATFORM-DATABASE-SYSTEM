import { Field, InputType, Int } from '@nestjs/graphql';
import { TravelType, VehicleType } from '@prisma/client';

@InputType()
export class CreateTravelDto {
  @Field()
  originName: string;

  @Field()
  destinationName: string;

  @Field()
  startsAt: Date;

  @Field({ nullable: true })
  duration?: string;

  @Field(() => VehicleType)
  vehicleType: VehicleType;

  @Field(() => TravelType)
  travelType: TravelType;

  @Field(() => Int)
  capacity: number;

  @Field()
  price: bigint;
}
