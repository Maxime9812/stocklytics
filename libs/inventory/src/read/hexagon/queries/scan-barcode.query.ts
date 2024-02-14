export type ScanBarcodeQueryResponse = ItemScanned | undefined;

export type ItemScanned = {
  type: 'item';
  id: string;
};

export type ScanBarcodeQueryPayload = {
  barcode: {
    type: string;
    value: string;
  };
  companyId: string;
};

export interface ScanBarcodeQuery {
  execute(payload: ScanBarcodeQueryPayload): Promise<ScanBarcodeQueryResponse>;
}
