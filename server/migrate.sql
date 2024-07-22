-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Superuser', 'Customer', 'TravelAgency');

CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

CREATE TYPE "VehicleType" AS ENUM ('Bus', 'Airplane', 'Train');

CREATE TYPE "TravelType" AS ENUM ('Domestic', 'Abroad');

CREATE TYPE "ConversationStatus" AS ENUM ('Pending', 'Answered', 'Closed');

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "nationalCode" TEXT,
    "phoneNumber" TEXT,
    "gender" "Gender",
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'Customer',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserOtp" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "token" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserOtp_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Travel" (
    "id" BIGSERIAL NOT NULL,
    "originName" TEXT NOT NULL,
    "destinationName" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "duration" TEXT,
    "price" BIGINT NOT NULL,
    "vehicleType" "VehicleType" NOT NULL,
    "travelType" "TravelType" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "creatorId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Travel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TicketReservation" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "travelId" BIGINT NOT NULL,
    "isPurchased" BOOLEAN NOT NULL DEFAULT false,
    "paymentId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketReservation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReservationSeat" (
    "userId" BIGINT NOT NULL,
    "ticketReservationId" BIGINT NOT NULL,
    "travelId" BIGINT NOT NULL,
    "seatPosition" BIGINT NOT NULL,
    "isMale" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ReservationSeat_pkey" PRIMARY KEY ("userId","ticketReservationId")
);

CREATE TABLE "Payment" (
    "id" BIGSERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "isPayed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "City" (
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "City_pkey" PRIMARY KEY ("name")
);

CREATE TABLE "Rate" (
    "amount" INTEGER NOT NULL,
    "ticketId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "Rate_pkey" PRIMARY KEY ("ticketId","userId")
);

CREATE TABLE "Discount" (
    "id" BIGSERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "maxAmount" INTEGER,
    "token" TEXT NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentDiscount" (
    "id" BIGSERIAL NOT NULL,
    "discountId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "PaymentDiscount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Conversation" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "responderId" BIGINT,
    "status" "ConversationStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastMessageRecieved" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TicketMessage" (
    "id" BIGSERIAL NOT NULL,
    "conversationId" BIGINT NOT NULL,
    "message" TEXT NOT NULL,
    "senderId" BIGINT NOT NULL,

    CONSTRAINT "TicketMessage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

CREATE UNIQUE INDEX "City_name_key" ON "City"("name");

ALTER TABLE "UserOtp" ADD CONSTRAINT "UserOtp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Travel" ADD CONSTRAINT "Travel_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Travel" ADD CONSTRAINT "Travel_originName_fkey" FOREIGN KEY ("originName") REFERENCES "City"("name") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Travel" ADD CONSTRAINT "Travel_destinationName_fkey" FOREIGN KEY ("destinationName") REFERENCES "City"("name") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TicketReservation" ADD CONSTRAINT "TicketReservation_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "TicketReservation" ADD CONSTRAINT "TicketReservation_travelId_fkey" FOREIGN KEY ("travelId") REFERENCES "Travel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "TicketReservation" ADD CONSTRAINT "TicketReservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ReservationSeat" ADD CONSTRAINT "ReservationSeat_travelId_fkey" FOREIGN KEY ("travelId") REFERENCES "Travel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ReservationSeat" ADD CONSTRAINT "ReservationSeat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ReservationSeat" ADD CONSTRAINT "ReservationSeat_ticketReservationId_fkey" FOREIGN KEY ("ticketReservationId") REFERENCES "TicketReservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Rate" ADD CONSTRAINT "Rate_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "TicketReservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Rate" ADD CONSTRAINT "Rate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PaymentDiscount" ADD CONSTRAINT "PaymentDiscount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PaymentDiscount" ADD CONSTRAINT "PaymentDiscount_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_responderId_fkey" FOREIGN KEY ("responderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
