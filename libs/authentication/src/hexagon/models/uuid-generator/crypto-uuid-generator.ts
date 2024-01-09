import { UuidGenerator } from '@app/authentication/hexagon/models/uuid-generator/uuid-generator';
import * as crypto from 'crypto';

export class CryptoUuidGenerator implements UuidGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}
