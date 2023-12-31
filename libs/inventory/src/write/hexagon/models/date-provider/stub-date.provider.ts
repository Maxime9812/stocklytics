import { DateProvider } from '@app/inventory/write/hexagon/models/date-provider/date.provider';

export class StubDateProvider implements DateProvider {
  private now: Date;
  getNow() {
    return this.now;
  }
  givenNow(now: Date) {
    this.now = now;
  }
}
