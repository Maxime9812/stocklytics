import {
  ScanBarcodeQuery,
  ScanBarcodeQueryPayload,
  ScanBarcodeQueryResponse,
} from '@app/inventory/read/hexagon/queries/scan-barcode.query';

export class StubScanBarcodeQuery implements ScanBarcodeQuery {
  private response: Map<string, ScanBarcodeQueryResponse> = new Map();
  async execute(
    payload: ScanBarcodeQueryPayload,
  ): Promise<ScanBarcodeQueryResponse> {
    return this.response.get(this.getPayloadKey(payload));
  }

  givenScanResponse(
    payload: ScanBarcodeQueryPayload,
    scanResponse: ScanBarcodeQueryResponse,
  ) {
    this.response.set(this.getPayloadKey(payload), scanResponse);
  }

  private getPayloadKey(payload: ScanBarcodeQueryPayload) {
    return `${payload.barcode.type}-${payload.barcode.value}-${payload.companyId}`;
  }
}
