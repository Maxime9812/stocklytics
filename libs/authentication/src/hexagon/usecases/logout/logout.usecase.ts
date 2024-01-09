import { AuthGateway } from '@app/authentication';

export class LogoutUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute() {
    await this.authGateway.logout();
  }
}
