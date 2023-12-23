import { AuthGateway } from '@app/inventory/hexagon/gateways/auth.gateway';

export class StubAuthGateway implements AuthGateway {
  private companyId: string;
  getCompanyId() {
    return this.companyId;
  }

  givenCompanyId(companyId: string) {
    this.companyId = companyId;
  }
}
