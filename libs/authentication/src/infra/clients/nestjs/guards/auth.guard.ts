import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGateway } from '@app/authentication/hexagon/gateways/auth.gateway';
import { IS_PUBLIC_KEY } from '@app/authentication/infra/clients/nestjs/metadata/public.metadata';
import { Reflector } from '@nestjs/core';

export class AuthGuard implements CanActivate {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly reflector: Reflector,
  ) {}
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const session: { userId: string } = context
      .switchToHttp()
      .getRequest().session;

    return !(!session || !session.userId);
  }
}
