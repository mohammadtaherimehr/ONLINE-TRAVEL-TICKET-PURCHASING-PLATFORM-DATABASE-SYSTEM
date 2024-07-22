import { Global, Module } from '@nestjs/common';
import { BigintScalar } from './bigint.schalar';
import { JsonScalar } from './json.schalar';
import { PrismaService } from './prisma.service';
import { TimestampSchalar } from './timestamp.schalar';

@Global()
@Module({
  providers: [PrismaService, BigintScalar, JsonScalar, TimestampSchalar],
  exports: [PrismaService],
})
export class PrismaModule {}
