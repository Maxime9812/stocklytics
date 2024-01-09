import {
  PasswordCompareParams,
  PasswordHasher,
} from '@app/authentication/hexagon/gateways/password-hasher';
import * as bcrypt from 'bcrypt';

export class BcryptPasswordHasher implements PasswordHasher {
  generateSalt(): string {
    return bcrypt.genSaltSync();
  }

  hash(password: string, salt: string): string {
    return bcrypt.hashSync(password, salt);
  }

  compare({
    passwordToCompare,
    password,
    salt,
  }: PasswordCompareParams): boolean {
    return bcrypt.compareSync(passwordToCompare, this.hash(password, salt));
  }
}
