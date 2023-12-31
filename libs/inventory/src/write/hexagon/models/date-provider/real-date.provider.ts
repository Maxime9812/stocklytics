import { DateProvider } from '@app/inventory/write/hexagon/models/date-provider/date.provider';

export class RealDateProvider implements DateProvider {
  getNow() {
    return new Date();
  }
}
