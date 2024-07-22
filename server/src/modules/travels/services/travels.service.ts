import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTravelDto } from '../dto';
import { User, VehicleType } from '@prisma/client';
import { DbService } from 'src/services/db';

@Injectable()
export class TravelsService {
  protected readonly paginationSize: number = 15;

  constructor(private readonly db: DbService) {}

  async payTickets(user: User, travelReservationIds: number[], amount: number) {
    await this.db.query({
      text: `
      UPDATE "TicketReservation"
      SET "isPurchased" = true
      WHERE "userId" = $1
        AND "id" = ANY($2);
    `,
      values: [user.id, travelReservationIds],
    });

    return this.db.queryOne({
      text: `
      INSERT INTO "Payment" ("isPayed", "amount")
      VALUES (true, $1)
      RETURNING *;
    `,
      values: [amount],
    });
  }

  bestSellTravelAgency(user: User) {
    return this.db.query({
      text: `
      SELECT *
      FROM "Travel"
      WHERE "creatorId" = $1
      ORDER BY (
        SELECT COUNT(*)
        FROM "TicketReservation"
        WHERE "TicketReservation"."travelId" = "Travel"."id"
      ) DESC
      LIMIT 1;
    `,
      values: [user.id],
    });
  }

  getCreatedTravels(
    user: User,
    price: number,
    time: Date,
    vehicleType: VehicleType,
  ) {
    return this.db.query({
      text: `
      SELECT *
      FROM "Travel"
      WHERE "creatorId" = $1
        AND "price" = $2
        AND "startsAt" = $3
        AND "vehicleType" = $4;
    `,
      values: [user.id, price, time, vehicleType],
    });
  }

  create(data: CreateTravelDto, userId: number | bigint) {
    return this.db.queryOne({
      text: `
      INSERT INTO "Travel" (price, capacity, startsAt, travelType, vehicleType, creatorId, destinationName, originName, duration)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `,
      values: [
        data.price,
        data.capacity,
        data.startsAt,
        data.travelType,
        data.vehicleType,
        userId,
        data.destinationName,
        data.originName,
        data.duration,
      ],
    });
  }

  async listTravels(
    type: VehicleType,
    originName: string,
    destinationName: string,
    amount: number,
    date: Date,
    pageNumber: number,
  ) {
    const resQuery = await this.db.query({
      text: `
      SELECT *
      FROM "Travel"
      WHERE "originName" = $1
        AND "destinationName" = $2
        AND "vehicleType" = $3
        AND "capacity" >= $4
        AND "startsAt" > $5
      ORDER BY "id"
      LIMIT $6
      OFFSET $7;
    `,
      values: [
        originName,
        destinationName,
        type,
        amount,
        date,
        this.paginationSize,
        pageNumber * this.paginationSize,
      ],
    });

    const countQuery = await this.db.queryOne({
      text: `
      SELECT COUNT(*)
      FROM "Travel"
      WHERE "originName" = $1
        AND "destinationName" = $2
        AND "capacity" >= $3
        AND "startsAt" > $4;
    `,
      values: [originName, destinationName, amount, date],
    });

    return {
      res: resQuery,
      count: countQuery.count,
    };
  }
  async getTravel(travelId: number | bigint) {
    const res = await this.db.queryOne({
      text: `SELECT "id", "originName", "destinationName", "startsAt", "duration", "price", "vehicleType", "travelType", "capacity", "creatorId", "createdAt" FROM "public"."Travel" WHERE ("id" = $1) LIMIT 1`,
      values: [travelId],
    });

    const reservations = await this.db.query({
      text: `SELECT "ReservationSeat".* FROM "TicketReservation" JOIN "ReservationSeat" ON "ReservationSeat"."ticketReservationId" = "TicketReservation"."id" WHERE "travelId" = $1`,
      values: [travelId],
    });

    return {
      ...res,
      seats: reservations,
    };
  }

  async rateTravel(ticketReservationId: bigint, rate: number, userId: bigint) {
    const reservation = await this.db.queryOne({
      text: `SELECT * FROM "TicketReservation" WHERE "userId" = $1 AND "isPurchased" = true AND "id" = $2`,
      values: [userId, ticketReservationId],
    });

    return this.db.queryOne({
      text: `INSERT INTO "Rate" ("amount", "ticketId", "userId") VALUES ($1, $2, $3)`,
      values: [rate, reservation.id, userId],
    });
  }

  async paySeat(travelId: bigint, userId: bigint, ticketReservationId: bigint) {
    const travel = await this.getTravelOrThrow(travelId);

    const ticketReservation = await this.db.query({
      text: `SELECT * FROM "ReservationSeat" WHERE "ticketReservationId" = $1 AND "userId" = $2`,
      values: [ticketReservationId, userId],
    });

    return this.db.queryOne({
      text: `UPDATE "TicketReservation" SET "isPurchased" = true WHERE "id" = $1 RETURNING *`,
      values: [ticketReservationId],
    });
  }

  async reserveSeat(
    seats: { seatId: number; isMale: boolean }[],
    travelId: bigint,
    userId: bigint,
  ) {
    await this.getTravelOrThrow(travelId);

    await this.validateSeatIsNotTaken(
      seats.map((item) => item.seatId),
      travelId,
    );

    const res = await this.db.queryOne({
      text: `INSERT INTO "TicketReservation" ("isPurchased", "travelId", "userId") VALUES ($1, $2, $3) RETURNING *`,
      values: [false, travelId, userId],
    });

    await this.db.queryOne({
      text: `INSERT INTO "ReservationSeat" ("travelId", "userId", "ticketReservationId", "isMale", "seatPosition") VALUES ${seats
        .map(
          (item) =>
            `(${travelId}, ${userId}, ${res.id}, ${item.isMale} ${item.seatId})`,
        )
        .join(' ')}`,
      values: [],
    });

    return res;
  }

  protected async validateSeatIsNotTaken(seatIds: number[], travelId: bigint) {
    const exists = await this.db.queryOne({
      text: `SELECT * FROM "ReservationSeat" WHERE ("travelId" = $1 AND "seatPosition" IN $2)`,
      values: [travelId, seatIds],
    });

    if (exists) throw new BadRequestException('This seat is taken');
  }

  protected async getTravelOrThrow(travelId: bigint) {
    const travel = await this.db.queryOne({
      text: `SELECT * FROM "Travel" WHERE (id = $1, "startsAt" = $2) LIMIT 1`,
      values: [travelId, new Date()],
    });

    if (!travel) throw new NotFoundException('Travel not found');

    return travel;
  }
}
