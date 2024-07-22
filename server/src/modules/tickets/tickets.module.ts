import { Module } from '@nestjs/common';
import { TicketService } from './services';
import { TicketResolver } from './resolvers';

@Module({
  providers: [TicketService, TicketResolver],
})
export class TicketsModule {}
