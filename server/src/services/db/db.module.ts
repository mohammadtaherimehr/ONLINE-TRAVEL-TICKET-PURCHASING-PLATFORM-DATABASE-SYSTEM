import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';

@Module({
  providers: [DbService],
  exports: [DbService],
})
@Global()
export class DbModule {}
