import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/in-memory-auth.gateway';
import { StubScanBarcodeQuery } from '@app/inventory/read/infra/queries/scan-barcode/stub-scan-barcode.query';
import { ScanBarcodeUseCase } from '@app/inventory/read/hexagon/usecases/scan-barcode/scan-barcode.usecase';

describe('Feature: Scan barcode', () => {
  test('Item is scanned', async () => {
    const authGateway = new InMemoryAuthGateway();
    authGateway.givenAuthUser({
      id: 'user-id',
      companyId: 'company-id',
    });

    const scanBarcodeQuery = new StubScanBarcodeQuery();
    scanBarcodeQuery.givenScanResponse(
      {
        barcode: {
          type: 'ean13',
          value: 'barcode-value',
        },
        companyId: 'company-id',
      },
      {
        type: 'item',
        id: 'item-id',
      },
    );

    const scan = await new ScanBarcodeUseCase(
      authGateway,
      scanBarcodeQuery,
    ).execute({
      type: 'ean13',
      value: 'barcode-value',
    });

    expect(scan).toEqual({
      type: 'item',
      id: 'item-id',
    });
  });
});
