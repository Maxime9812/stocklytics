import {
  AuthGateway,
  AuthUser,
} from '@app/authentication/hexagon/gateways/auth.gateway';

export class InMemoryAuthGateway implements AuthGateway {
  private _authUser: AuthUser;

  givenAuthUser(authUser: AuthUser) {
    this._authUser = authUser;
  }

  get authUser() {
    return this._authUser;
  }

  async login(authUser: AuthUser): Promise<void> {
    this._authUser = authUser;
  }

  async logout(): Promise<void> {
    this._authUser = undefined;
  }

  currentUser(): AuthUser {
    return this._authUser;
  }
}
