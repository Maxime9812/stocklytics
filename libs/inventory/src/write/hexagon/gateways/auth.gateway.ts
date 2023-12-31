export interface AuthGateway {
  getCompanyId(): string;
  setCompanyId(companyId: string): void;
}
