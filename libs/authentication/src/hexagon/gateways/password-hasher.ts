export type PasswordCompareParams = {
  password: string;
  passwordToCompare: string;
  salt: string;
};
export interface PasswordHasher {
  generateSalt(): string;
  hash(password: string, salt: string): string;
  compare(params: PasswordCompareParams): boolean;
}
