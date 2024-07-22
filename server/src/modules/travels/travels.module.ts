import { Module } from '@nestjs/common';
import { TravelsService } from './services';
import { AgencyTravelResolver, TravelsResolver } from './resolvers';
import { registerEnumType } from '@nestjs/graphql';
import { TravelType, VehicleType } from '@prisma/client';

registerEnumType(VehicleType, { name: 'vehicleType' });
registerEnumType(TravelType, { name: 'travelType' });

@Module({
  providers: [TravelsService, TravelsResolver, AgencyTravelResolver],
})
export class TravelsModule {}
