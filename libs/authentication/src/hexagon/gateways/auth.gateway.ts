export interface AuthGateway {
  currentUserId(): string;
  getCompanyId(): string;
  setCompanyId(companyId: string): void;
  setCurrentUserId(userId: string): void;
}
