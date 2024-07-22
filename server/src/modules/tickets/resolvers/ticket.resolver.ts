import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
  Query,
} from '@nestjs/graphql';
import { GraphqlJwtGuard, SuperuserGuard } from 'src/modules/accounts/guards';
import { TicketService } from '../services';
import { GraphqlAuth } from 'src/modules/accounts/decorators';
import { User } from '@prisma/client';
import { TicketEntity, TicketMessageEntity } from '../entities/';

@Resolver(() => TicketEntity)
@UseGuards(GraphqlJwtGuard)
export class TicketResolver {
  constructor(private readonly ticketService: TicketService) {}

  @Query(() => [TicketEntity])
  getUserTickets(@GraphqlAuth() user: User) {
    return this.ticketService.getUserTickets(user);
  }

  @Query(() => [TicketEntity])
  @UseGuards(SuperuserGuard)
  getPendingTickets() {
    return this.ticketService.getPendingTickets();
  }

  @Query(() => TicketEntity)
  getTicket(@Args('id') id: number, @GraphqlAuth() user: User) {
    return this.ticketService.getOne(id, user);
  }

  @Mutation(() => TicketEntity)
  createTicket(
    @Args('message') message: string,
    @Args('title') title: string,
    @GraphqlAuth() user: User,
  ) {
    return this.ticketService.create(message, title, user.id);
  }

  @Mutation(() => Boolean)
  closeTicket(@GraphqlAuth() user: User, @Args('id') id: bigint) {
    return this.ticketService.close(user.id, id).then(() => true);
  }

  @Mutation(() => TicketEntity)
  sendMessage(
    @Args('message') message: string,
    @Args('id') ticketId: bigint,
    @GraphqlAuth() user: User,
  ) {
    return this.ticketService.sendMessage(message, ticketId, user.id);
  }

  @Mutation(() => TicketMessageEntity)
  @UseGuards(SuperuserGuard)
  respondToTicket(
    @Args('id') id: bigint,
    @Args('message') message: string,
    @GraphqlAuth() user: User,
  ) {
    return this.ticketService.respondToTicket(id, message, user);
  }

  @ResolveField('messages', () => [TicketMessageEntity])
  getMessages(@Parent() ticket: TicketEntity) {
    return this.ticketService.getMessages(ticket);
  }
}
