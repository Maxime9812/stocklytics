import { AuthGateway } from '@app/authentication';
import { GetCurrentUserQuery } from '@app/authentication/hexagon/queries/get-current-user.query';

export class GetCurrentUserUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly getCurrentUserQuery: GetCurrentUserQuery,
  ) {}

  async execute() {
    const authUser = this.authGateway.currentUser();
    if (!authUser) return undefined;
    return this.getCurrentUserQuery.execute(authUser.id);
  }
}
