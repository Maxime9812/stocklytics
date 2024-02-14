import { IsString } from 'class-validator';

export class ScanBarcodeParams {
  @IsString()
  type: string;
  @IsString()
  value: string;
}
