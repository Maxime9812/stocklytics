import { IsEnum, IsUUID } from 'class-validator';
import { BarcodeType } from '@app/inventory/write/hexagon/models/barcode';

export class BarcodeDto {
  @IsEnum(BarcodeType)
  type: BarcodeType;
  value: string;
}

export class LinkBarcodeToItemDto {
  @IsUUID()
  itemId: string;

  barcode: BarcodeDto;
}
