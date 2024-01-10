import { AuthGateway, AuthUser } from '@app/authentication';
import { Store } from 'express-session';

type Session = {
  id: string;
  user: AuthUser;
};

export class RequestSessionAuthGateway implements AuthGateway {
  private readonly session: Session;
  constructor(
    request: Request,
    private readonly redisStore: Store,
  ) {
    this.session = (request as any).session as Session;
  }

  async logout(): Promise<void> {
    this.redisStore.destroy(this.session.id);
  }

  currentUser(): AuthUser {
    return this.session.user;
  }

  async login(authUser: AuthUser): Promise<void> {
    this.session.user = authUser;
  }
}
