export type ItemPm = {
  id: string;
  name: string;
  quantity: number;
  companyId: string;
  folderId?: string;
  barcodeType?: string;
  barcodeValue?: string;
  note: string;
  createdAt: Date;
};
