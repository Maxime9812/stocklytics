import { DateProvider } from '@app/inventory/hexagon/models/date-provider/date.provider';

export class RealDateProvider implements DateProvider {
  getNow() {
    return new Date();
  }
}
