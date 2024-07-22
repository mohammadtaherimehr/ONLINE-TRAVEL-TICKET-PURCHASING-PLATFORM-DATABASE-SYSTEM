import { Field, ObjectType, Resolver, Query, Args } from '@nestjs/graphql';
import { DbService } from 'src/services/db';
import { PrismaService } from 'src/services/settings';

@ObjectType()
export class City {
  @Field()
  name: string;
}

@Resolver(() => City)
export class CityResolver {
  constructor(private readonly db: DbService) {}

  @Query(() => [City])
  getCities(@Args('name', { nullable: true }) name?: string) {
    return this.db.query({
      text: `SELECT "name", "isInternal" FROM "public"."City" WHERE "isActive" = true`,
      values: [],
    });
  }
}
