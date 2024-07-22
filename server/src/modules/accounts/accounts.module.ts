import { Module } from '@nestjs/common';
import { ACCOUNT_RESOLVERS } from './resolvers';
import { ACCOUNT_SERVICES } from './services';
import { JwtModule } from '@nestjs/jwt';
import { GraphqlJwtGuard, SuperuserGuard, TravelAgencyGuard } from './guards';
import { JwtStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    SuperuserGuard,
    TravelAgencyGuard,
    GraphqlJwtGuard,
    JwtStrategy,
    ...ACCOUNT_SERVICES,
    ...ACCOUNT_RESOLVERS,
  ],
})
export class AccountsModule {}
