import { AuthGateway } from '@app/authentication/hexagon/gateways/auth.gateway';

export class InMemoryAuthGateway implements AuthGateway {
  private companyId: string;
  private _userId: string;

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
    return this._userId;
  }

  setCurrentUserId(userId: string): void {
    this._userId = userId;
  }

  get userId(): string {
    return this._userId;
  }

  async login(userId: string): Promise<void> {
    this._userId = userId;
  }

  givenUserId(userId: string) {
    this._userId = userId;
  }

  async logout(): Promise<void> {
    this._userId = undefined;
  }
}
