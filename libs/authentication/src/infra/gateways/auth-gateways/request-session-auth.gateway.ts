import { AuthGateway, AuthUser } from '@app/authentication';
import { Session, Store } from 'express-session';

type AuthSession = Session & {
  user: AuthUser;
};

export class RequestSessionAuthGateway implements AuthGateway {
  private readonly session: AuthSession;
  constructor(
    request: Request,
    private readonly redisStore: Store,
  ) {
    this.session = (request as any).session as AuthSession;
  }

  async logout(): Promise<void> {
    this.redisStore.destroy(this.session.id);
    this.session.cookie.expires = new Date(Date.now());
  }

  currentUser(): AuthUser {
    return this.session.user;
  }

  async login(authUser: AuthUser): Promise<void> {
    this.session.user = authUser;
  }
}
