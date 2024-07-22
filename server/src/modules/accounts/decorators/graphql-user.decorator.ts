import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GraphqlAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const user = GqlExecutionContext.create(ctx).getArgByIndex(2).req.user;

    console.log(user);

    if (typeof data === 'string') {
      return user[data];
    }

    return user;
  },
);
