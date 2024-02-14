import { AuthGateway } from '@app/authentication';
import { ScanBarcodeQuery } from '@app/inventory/read/hexagon/queries/scan-barcode.query';

export type ScanBarcodeUseCasePayload = {
  type: string;
  value: string;
};

export class ScanBarcodeUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly scanBarcodeQuery: ScanBarcodeQuery,
  ) {}

  async execute({ type, value }: ScanBarcodeUseCasePayload) {
    return this.scanBarcodeQuery.execute({
      barcode: {
        type,
        value,
      },
      companyId: this.authGateway.currentUser().companyId,
    });
  }
}
