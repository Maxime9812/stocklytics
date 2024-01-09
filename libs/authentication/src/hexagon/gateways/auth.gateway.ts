export interface AuthGateway {
  login(userId: string): Promise<void>;
  logout(): Promise<void>;
  currentUserId(): string;
  getCompanyId(): string;
  setCompanyId(companyId: string): void;
  setCurrentUserId(userId: string): void;
}
