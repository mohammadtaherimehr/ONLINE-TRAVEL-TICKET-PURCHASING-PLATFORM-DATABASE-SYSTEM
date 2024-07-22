import { AuthResolver } from './auth.resolver';
import { CityResolver } from './city.resolver';

export * from './auth.resolver';
export * from './city.resolver';

export const ACCOUNT_RESOLVERS = [AuthResolver, CityResolver];
