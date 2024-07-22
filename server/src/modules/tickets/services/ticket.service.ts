import { Injectable } from '@nestjs/common';
import { TicketEntity } from '../entities';
import { User, UserRole } from '@prisma/client';
import { DbService } from 'src/services/db';

@Injectable()
export class TicketService {
  constructor(private readonly db: DbService) {}

  getOne(id: number, user: User) {
    if (user.role === UserRole.Superuser) {
      return this.db.queryOne({
        text: `
      SELECT "id", "userId", "title", "responderId", "status", "createdAt", "lastMessageRecieved" FROM "Conversation" WHERE ("id" = $1)`,
        values: [id],
      });
    }

    return this.db.queryOne({
      text: `
      SELECT "id", "userId", "title", "responderId", "status", "createdAt", "lastMessageRecieved" FROM "Conversation" WHERE ("id" = $1 AND "userId" = $2)`,
      values: [id, user.id],
    });
  }

  getPendingTickets() {
    return this.db.query({
      text: `SELECT * FROM "Conversation" WHERE ("status" = 'Pending')`,
      values: [],
    });
  }

  getUserTickets(user: User) {
    return this.db.query({
      values: [user.id],
      text: `SELECT * FROM "Conversation" WHERE ("id" = $1)`,
    });
  }

  async respondToTicket(id: bigint, message: string, user: User) {
    const res = await this.db.queryOne({
      text: `UPDATE "Conversation"
              SET status = 'Answered', "responderId" = $2, "lastMessageRecieved" = $3 WHERE "id" = $1 RETURNING *`,
      values: [id, user.id, new Date()],
    });

    await this.db.queryOne({
      text: `INSERT INTO "TicketMessage" ("conversationId","message","senderId") VALUES ($1, $2, $3)`,
      values: [res.id, message, user.id],
    });

    return res;
  }

  getMessages(ticket: TicketEntity) {
    return this.db.query({
      text: `SELECT "message", "senderId" FROM "TicketMessage" WHERE ("conversationId" = $1)`,
      values: [ticket.id],
    });
  }

  async sendMessage(message: string, ticketId: bigint, userId: bigint) {
    const res = await this.db.queryOne({
      text: `UPDATE "Conversation"
SET status = 'Pending' WHERE "id" = $1 RETURNING *;
`,
      values: [Number(ticketId)],
    });

    await this.db.queryOne({
      text: `INSERT INTO "TicketMessage" ("conversationId","message","senderId") VALUES ($1, $2, $3)`,
      values: [ticketId, message, userId],
    });

    return res;
  }

  close(userId: bigint, id: bigint) {
    return this.db.queryOne({
      text: `UPDATE "Conversation"
SET status = 'Closed' WHERE "id" = $1 AND "userId" = $2 RETURNING *;
`,
      values: [Number(id), userId],
    });
  }

  async create(message: string, title: string, userId: bigint) {
    const res = await this.db.queryOne({
      text: `INSERT INTO "Conversation" ("userId", "title") VALUES ($1, $2) RETURNING *`,
      values: [userId, title],
    });

    await this.db.queryOne({
      text: `INSERT INTO "TicketMessage" ("conversationId", "message", "senderId") VALUES ($1, $2, $3)`,
      values: [res.id, message, userId],
    });

    return res;
  }
}
