import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { PrismaModule } from './services/settings';
import { ConfigModule } from '@nestjs/config';
import { Modules } from './modules';
import { DbModule } from './services/db';

@Module({
  imports: [
    PrismaModule,
    DbModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: true,
      graphiql: true,
    }),
    Modules,
  ],
})
export class AppModule {}
