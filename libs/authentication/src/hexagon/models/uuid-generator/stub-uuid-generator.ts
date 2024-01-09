import { UuidGenerator } from '@app/authentication/hexagon/models/uuid-generator/uuid-generator';

export class StubUuidGenerator implements UuidGenerator {
  private uuid: string;
  generate(): string {
    return this.uuid;
  }

  givenUuid(uuid: string): void {
    this.uuid = uuid;
  }
}
