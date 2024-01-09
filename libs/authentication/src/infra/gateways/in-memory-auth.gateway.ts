import { AuthGateway } from '@app/authentication/hexagon/gateways/auth.gateway';

export class InMemoryAuthGateway implements AuthGateway {
  private companyId: string;
  private userId: string;

  constructor() {}
  getCompanyId() {
    return this.companyId;
  }

  givenCompanyId(companyId: string) {
    this.companyId = companyId;
  }

  setCompanyId(companyId: string): void {
    this.companyId = companyId;
  }

  currentUserId(): string {
    return this.userId;
  }

  setCurrentUserId(userId: string): void {
    this.userId = userId;
  }
}
