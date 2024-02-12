export const BarcodeType = ['ean13', 'ean8', 'code128', 'qr'] as const;
export type BarcodeType = (typeof BarcodeType)[number];

export type Barcode = {
  readonly type: BarcodeType;
  readonly value: string;
};
