import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class SuperuserGuard implements CanActivate {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = this.getRequest(context);

    if (!req.user || req.user.role !== UserRole.Superuser) {
      throw new UnauthorizedException('Not authorized');
    }

    return true;
  }
}
