import { Knex } from 'knex';
import {
  ScanBarcodeQuery,
  ScanBarcodeQueryPayload,
  ScanBarcodeQueryResponse,
} from '@app/inventory/read/hexagon/queries/scan-barcode.query';
import { ItemPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item.pm';

export class KnexScanBarcodeQuery implements ScanBarcodeQuery {
  constructor(private readonly knex: Knex) {}

  async execute(
    payload: ScanBarcodeQueryPayload,
  ): Promise<ScanBarcodeQueryResponse> {
    const item = await this.findItemByBarcode(payload);

    if (item) return this.createItemScanned(item.id);

    return;
  }

  private createItemScanned(itemId: string): ScanBarcodeQueryResponse {
    return {
      type: 'item',
      id: itemId,
    };
  }

  private findItemByBarcode({ barcode, companyId }: ScanBarcodeQueryPayload) {
    return this.knex<ItemPm>('items').first().where({
      barcodeType: barcode.type,
      barcodeValue: barcode.value,
      companyId,
    });
  }
}
