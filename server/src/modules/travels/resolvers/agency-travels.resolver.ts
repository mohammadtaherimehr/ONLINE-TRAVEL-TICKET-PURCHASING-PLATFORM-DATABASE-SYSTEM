import { UseGuards } from '@nestjs/common';
import {
  Query,
  Args,
  Resolver,
  Mutation,
  registerEnumType,
} from '@nestjs/graphql';
import {
  GraphqlJwtGuard,
  TravelAgencyGuard,
} from 'src/modules/accounts/guards';
import { TravelEntity } from '../entities';
import { TravelsService } from '../services';
import { User, VehicleType } from '@prisma/client';
import { GraphqlAuth } from 'src/modules/accounts/decorators';
import { CreateTravelDto } from '../dto';

@Resolver(() => TravelEntity)
@UseGuards(GraphqlJwtGuard, TravelAgencyGuard)
export class AgencyTravelResolver {
  constructor(private readonly travelsService: TravelsService) {}

  @Query(() => [TravelEntity])
  @UseGuards(GraphqlJwtGuard, TravelAgencyGuard)
  getCreatedTravels(
    @GraphqlAuth() user: User,
    @Args('price', { nullable: true }) price?: number,
    @Args('time', { nullable: true })
    time?: Date,
    @Args('vehicleType', { nullable: true }) vehicleType?: VehicleType,
  ) {
    return this.travelsService.getCreatedTravels(
      user,
      price,
      time,
      vehicleType,
    );
  }

  @Query(() => TravelEntity)
  @UseGuards(GraphqlJwtGuard, TravelAgencyGuard)
  getBestSellTravel(@GraphqlAuth() user: User) {
    return this.travelsService.bestSellTravelAgency(user);
  }

  @Mutation(() => TravelEntity)
  @UseGuards(GraphqlJwtGuard, TravelAgencyGuard)
  createTravel(@Args('data') data: CreateTravelDto, @GraphqlAuth() user: User) {
    return this.travelsService.create(data, user.id);
  }
}
