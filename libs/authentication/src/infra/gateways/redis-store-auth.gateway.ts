import { AuthGateway } from '@app/authentication';

export class RedisStoreAuthGateway implements AuthGateway {
  private readonly session: { userId: string; id: string };
  constructor(request: Request) {
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
}
