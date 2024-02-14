import { IsString } from 'class-validator';

export class ScanBarcodeDto {
  @IsString()
  type: string;
  @IsString()
  value: string;
}
