import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateUserDto, LoginDto } from '../dto';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import * as moment from 'moment';
import { DbService } from 'src/services/db';

export type UserWithToken = User & { jwtToken?: string };

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger();

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly db: DbService,
  ) {}

  async create(data: CreateUserDto) {
    return this.db.query({
      text: `
      INSERT INTO "User" ("name","email","phoneNumber","password","role","isVerified") VALUES ($1,$2,$3,$4,$5,$6) RETURNING "id", "name", "email", "nationalCode", "phoneNumber", "gender", "password", "role", "isVerified", "createdAt"`,
      values: [
        data.name,
        data.email,
        data.phoneNumber,
        data.password,
        data.role,
        false,
      ],
    });
  }

  async login(data: LoginDto) {
    const user: UserWithToken = (
      await this.db.query({
        text: `SELECT "id", "name", "email", "nationalCode", "phoneNumber", "gender", "password", "role", "isVerified" FROM "User" WHERE ("email" = $1 OR "phoneNumber" = $1) LIMIT 1`,
        values: [data.username],
      })
    )[0];

    if (!user) throw new BadRequestException('کاربر پیدا نشد');

    if (!(await this.isPasswordMatches(data.password, user.password)))
      throw new BadRequestException('رمز عبور اشتباه می باشد');

    if (!user.isVerified) throw new BadRequestException('کاربر فعال نمی باشد');

    user.jwtToken = this.generateJwtToken(user);

    return user;
  }

  getProfile(userId: bigint) {
    return this.db.queryOne({
      text: `
      SELECT "id", "name", "email", "nationalCode", "phoneNumber", "gender", "role", "public"."User"."createdAt" FROM "public"."User" WHERE ("id" = $1) LIMIT 1`,
      values: [userId],
    });
  }

  updateProfile(
    userId: number | bigint,
    name?: string,
    nationalCode?: string,
    phoneNumber?: string,
    _email?: string,
  ) {
    return this.db.queryOne({
      text: `
      UPDATE "public"."User" SET "name" = $1, "nationalCode" = $2, "phoneNumber" = $3 WHERE ("id" = $4) RETURNING "id", "name", "email", "nationalCode", "phoneNumber", "gender", "password", "role", "isVerified"`,
      values: [name, nationalCode, phoneNumber, userId],
    });
  }

  async updatePassword(userId: bigint, password: string, newPassword: string) {
    const user = await this.db.queryOne({
      text: `SELECT "password" FROM "User" WHERE "id" = $1 LIMIT 1`,
      values: [userId],
    });

    if (!user) throw new BadRequestException('کاربر پیدا نشد');

    if (!(await this.isPasswordMatches(password, user.password)))
      throw new BadRequestException('رمز عبور اشتباه است');

    return this.db.queryOne({
      text: `UPDATE "User" SET "password" = $1 WHERE ("id" = $2) RETURNING "id", "name", "email", "nationalCode", "phoneNumber", "gender", "password", "role", "isVerified", "createdAt"`,
      values: [await this.hashPassword(newPassword), userId],
    });
  }

  async verifyUser(otpCode: string, email): Promise<User> {
    const otp = (
      await this.db.query({
        text: `
      SELECT "UserOtp"."id", "UserOtp"."userId", "token" FROM "UserOtp" JOIN "User" ON "User"."id" = "UserOtp"."userId" WHERE ("UserOtp"."createdAt" < $1 AND "isUsed" = false AND "token" = $2 AND "User"."email" = $3) LIMIT 1 OFFSET 0`,
        values: [
          moment()
            .subtract(this.config.get('OTP_EXPIRE_MINUTES'), 'minutes')
            .toDate(),
          otpCode,
          email,
        ],
      })
    )[0];

    if (!otp) throw new BadRequestException('لینک معتبر نمی باشد');

    const res = await this.db.query({
      text: `UPDATE "User" SET "isVerified" = true WHERE ("id" = $1) RETURNING "id", "name", "email", "nationalCode", "phoneNumber", "gender", "password", "role", "isVerified"`,
      values: [Number(otp.userId)],
    });

    return res[0];
  }

  sendOtp(user: User) {
    const otpCode = this.generateHash(user.id, user.createdAt.toString());

    this.logger.debug('User OTP code for ' + user.name + ' is : ' + otpCode);

    return this.db.query({
      text: `INSERT INTO "UserOtp" ("userId","token") VALUES ($1,$2) RETURNING "public"."UserOtp"."id"`,
      values: [Number(user.id), otpCode],
    });
  }

  protected isPasswordMatches(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return argon2.verify(hash, password, {
      secret: Buffer.from(this.config.getOrThrow('HASH_SECRET')),
    });
  }

  protected generateHash(userId: bigint, registrationTime: string): string {
    const combinedString: string = userId + registrationTime;
    const hashObject = crypto.createHash('sha256');

    hashObject.update(combinedString);

    const hashCode: string = hashObject.digest('hex');

    return hashCode;
  }

  protected hashPassword(password: string) {
    return argon2.hash(password, {
      secret: Buffer.from(this.config.getOrThrow('HASH_SECRET')),
    });
  }

  protected generateJwtToken(user: User) {
    return this.jwt.sign(
      {
        id: Number(user.id),
        name: user.name,
        sub: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        nationalCode: user.nationalCode,
      },
      {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_TOKEN_EXPIRE'),
      },
    );
  }
}
