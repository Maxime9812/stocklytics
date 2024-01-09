import { PasswordHasher } from '@app/authentication/hexagon/gateways/password-hasher';

export class StubPasswordHasher implements PasswordHasher {
  private hashedPasswords: Map<string, string> = new Map();
  private compareResults: Map<string, boolean> = new Map();

  hash(password: string): string {
    return this.hashedPasswords.get(password);
  }

  compare(password: string, hash: string): boolean {
    return this.compareResults.get(`${password}-${hash}`);
  }

  givenCompareResult(
    params: { password: string; hash: string },
    result: boolean,
  ) {
    this.compareResults.set(`${params.password}-${params.hash}`, result);
  }

  givenHashedPassword(password: string, hashedPassword: string) {
    this.hashedPasswords.set(password, hashedPassword);
  }
}
