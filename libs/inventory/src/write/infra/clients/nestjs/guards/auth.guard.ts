import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGateway } from '@app/inventory/write/hexagon/gateways/auth.gateway';

export class AuthGuard implements CanActivate {
  constructor(private readonly authGateway: AuthGateway) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return false;
    }
    this.authGateway.setCompanyId(token);
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
