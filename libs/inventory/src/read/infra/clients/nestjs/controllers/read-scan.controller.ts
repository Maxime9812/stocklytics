import { Controller, Get, Param } from '@nestjs/common';
import { ScanBarcodeUseCase } from '@app/inventory/read/hexagon/usecases/scan-barcode/scan-barcode.usecase';
import { ScanBarcodeParams } from '@app/inventory/read/infra/clients/nestjs/params/scan-barcode.params';

@Controller('scan')
export class ReadScanController {
  constructor(private readonly scanBarcodeUseCase: ScanBarcodeUseCase) {}

  @Get()
  async scan(@Param() params: ScanBarcodeParams) {
    return await this.scanBarcodeUseCase.execute(params);
  }
}
