import { AuthGateway } from '@app/authentication';
import { Store } from 'express-session';

export class RequestSessionAuthGateway implements AuthGateway {
  private readonly session: { userId: string; id: string };
  constructor(
    request: Request,
    private readonly redisStore: Store,
  ) {
    this.session = (request as any).session as { userId: string; id: string };
  }

  async login(userId: string) {
    this.session.userId = userId;
  }

  currentUserId(): string {
    return this.session.userId;
  }

  getCompanyId(): string {
    return this.session.userId;
  }

  setCompanyId(companyId: string): void {}

  setCurrentUserId(userId: string): void {}

  async logout(): Promise<void> {
    this.redisStore.destroy(this.session.id);
  }
}
