import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { GraphqlAuth } from '../decorators';
import { CreateUserDto, LoginDto } from '../dto';
import { UserEntity } from '../entities';
import { AuthService } from '../services';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtGuard } from '../guards';

@Resolver(() => UserEntity)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => UserEntity)
  @UseGuards(GraphqlJwtGuard)
  getProfile(@GraphqlAuth() user: User) {
    return this.authService.getProfile(user.id);
  }

  @Mutation(() => UserEntity)
  async register(@Args('data') data: CreateUserDto) {
    const user = (await this.authService.create(data))[0];

    await this.authService.sendOtp(user);

    return user;
  }

  @Mutation(() => UserEntity)
  verifyUser(@Args('token') token: string, @Args('email') email: string) {
    return this.authService.verifyUser(token, email);
  }

  @Mutation(() => UserEntity)
  login(@Args('data') data: LoginDto) {
    return this.authService.login(data);
  }

  @Mutation(() => UserEntity)
  @UseGuards(GraphqlJwtGuard)
  updateProfile(
    @GraphqlAuth() user: User,
    @Args('name', { nullable: true }) name: string,
    @Args('nationalCode', { nullable: true }) nationalCode: string,
    @Args('email', { nullable: true }) email: string,
    @Args('phoneNumber', { nullable: true }) phoneNumber: string,
  ) {
    return this.authService.updateProfile(
      user.id,
      name,
      nationalCode,
      phoneNumber,
      email,
    );
  }

  @Mutation(() => UserEntity)
  @UseGuards(GraphqlJwtGuard)
  changePassword(
    @GraphqlAuth() user: User,
    @Args('password') password: string,
    @Args('newPassword') newPassword: string,
  ) {
    return this.authService.updatePassword(user.id, password, newPassword);
  }
}
