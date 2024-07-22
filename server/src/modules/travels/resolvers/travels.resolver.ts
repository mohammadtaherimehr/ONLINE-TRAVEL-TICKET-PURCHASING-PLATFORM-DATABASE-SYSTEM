import {
  Resolver,
  Query,
  Args,
  Mutation,
  Int,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { TravelsService } from '../services';
import { User, VehicleType } from '@prisma/client';
import { TravelEntity } from '../entities';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtGuard } from 'src/modules/accounts/guards';
import { ReserveTravelDto } from '../dto';
import { GraphqlAuth } from 'src/modules/accounts/decorators';
import { JsonScalar } from 'src/services/settings/json.schalar';

@ObjectType()
export class ListTravelResult {
  @Field(() => [TravelEntity])
  res: TravelEntity[];

  @Field(() => Int)
  count: number;
}

@Resolver(() => TravelEntity)
export class TravelsResolver {
  constructor(private readonly travelsService: TravelsService) {}

  @Query(() => ListTravelResult)
  getTravels(
    @Args('type') type: VehicleType,
    @Args('source') source: string,
    @Args('destination') destination: string,
    @Args('date') date: Date,
    @Args('amount') amount: number,
    @Args('pageNumber') pageNumber: number,
  ) {
    return this.travelsService.listTravels(
      type,
      source,
      destination,
      amount,
      date,
      pageNumber,
    );
  }

  @Query(() => TravelEntity)
  getTravel(@Args('travelId') travelId: number) {
    return this.travelsService.getTravel(travelId);
  }

  @Mutation(() => JsonScalar)
  @UseGuards(GraphqlJwtGuard)
  reserveTravel(
    @Args('data', { type: () => [ReserveTravelDto] }) seats: ReserveTravelDto[],
    @Args('travelId') travelId: bigint,
    @GraphqlAuth() user: User,
  ) {
    return this.travelsService.reserveSeat(seats, travelId, user.id);
  }

  @Mutation(() => JsonScalar)
  @UseGuards(GraphqlJwtGuard)
  rateTicketTravel(
    @Args('rate') rate: number,
    @GraphqlAuth() user: User,
    @Args('ticketReservationId') ticketReservationId: bigint,
  ) {
    return this.travelsService.rateTravel(ticketReservationId, rate, user.id);
  }

  @Mutation(() => JsonScalar)
  @UseGuards(GraphqlJwtGuard)
  payReservation(
    @Args('travelId') travelId: bigint,
    @GraphqlAuth() user: User,
    @Args('ticketReservationId') ticketReservationId: bigint,
  ) {
    return this.travelsService.paySeat(travelId, user.id, ticketReservationId);
  }

  @Mutation(() => JsonScalar)
  @UseGuards(GraphqlJwtGuard)
  createPayment(
    @GraphqlAuth() user: User,
    @Args('travelReservationIds', { type: () => [BigInt] })
    travelReservationIds: number[],
    @Args('amount') amount: number,
  ) {
    return this.travelsService.payTickets(user, travelReservationIds, amount);
  }
}
