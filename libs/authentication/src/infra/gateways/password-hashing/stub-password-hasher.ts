import { PasswordHasher } from '@app/authentication/hexagon/gateways/password-hasher';

export class StubPasswordHasher implements PasswordHasher {
  private hashedPasswords: Map<string, string> = new Map();

  hash(password: string): string {
    return this.hashedPasswords.get(password);
  }

  compare(password: string, hash: string): boolean {
    return false;
  }

  givenHashedPassword(password: string, hashedPassword: string) {
    this.hashedPasswords.set(password, hashedPassword);
  }
}
