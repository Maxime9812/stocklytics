import { DateProvider } from '@app/authentication/hexagon/models/date-provider/date.provider';

export class RealDateProvider implements DateProvider {
  getNow() {
    return new Date();
  }
}
