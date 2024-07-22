import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts';
import { TravelsModule } from './travels';
import { TicketsModule } from './tickets';

export * from './accounts';
export * from './travels';
export * from './tickets';

@Module({
  imports: [AccountsModule, TravelsModule, TicketsModule],
  exports: [AccountsModule, TravelsModule, TicketsModule],
})
export class Modules {}
