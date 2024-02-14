import { Body, Controller, Post } from '@nestjs/common';
import { ScanBarcodeUseCase } from '@app/inventory/read/hexagon/usecases/scan-barcode/scan-barcode.usecase';
import { ScanBarcodeDto } from '@app/inventory/read/infra/clients/nestjs/dtos/scan-barcode.dto';

@Controller('scan')
export class ReadScanController {
  constructor(private readonly scanBarcodeUseCase: ScanBarcodeUseCase) {}

  @Post()
  async scan(@Body() payload: ScanBarcodeDto) {
    return await this.scanBarcodeUseCase.execute(payload);
  }
}
