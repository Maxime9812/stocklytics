export type AuthUser = {
  id: string;
  companyId: string;
};

export interface AuthGateway {
  login(authUser: AuthUser): Promise<void>;
  logout(): Promise<void>;
  currentUser(): AuthUser;
}
