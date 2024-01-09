import {
  PasswordCompareParams,
  PasswordHasher,
} from '@app/authentication/hexagon/gateways/password-hasher';

export class StubPasswordHasher implements PasswordHasher {
  private hashedPasswords: Map<string, string> = new Map();
  private _salt: string;

  generateSalt(): string {
    return this._salt;
  }
  givenSalt(salt: string) {
    this._salt = salt;
  }

  hash(password: string, salt: string): string {
    return this.hashedPasswords.get(this.passwordWithSalt(password, salt));
  }

  compare(params: PasswordCompareParams): boolean {
    return false;
  }

  givenHashedPassword({
    password,
    hashedPassword,
    salt,
  }: {
    password: string;
    hashedPassword: string;
    salt: string;
  }) {
    this.hashedPasswords.set(
      this.passwordWithSalt(password, salt),
      hashedPassword,
    );
  }

  private passwordWithSalt(password: string, salt: string) {
    return `${password}-${salt}`;
  }
}
