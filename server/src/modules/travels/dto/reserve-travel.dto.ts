import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ReserveTravelDto {
  @Field()
  isMale: boolean;

  @Field()
  seatId: number;
}
