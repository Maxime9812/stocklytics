import { IsString } from 'class-validator';

export class ScanBarcodeQuery {
  @IsString()
  type: string;
  @IsString()
  value: string;
}
