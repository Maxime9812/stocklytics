import { Controller, Get, Query, Res } from '@nestjs/common';
import { ScanBarcodeUseCase } from '@app/inventory/read/hexagon/usecases/scan-barcode/scan-barcode.usecase';
import { ScanBarcodeQuery } from '@app/inventory/read/infra/clients/nestjs/queries/scan-barcode.query';
import { Response } from 'express';

@Controller('scan')
export class ReadScanController {
  constructor(private readonly scanBarcodeUseCase: ScanBarcodeUseCase) {}

  @Get()
  async scan(@Query() query: ScanBarcodeQuery, @Res() res: Response) {
    const result = await this.scanBarcodeUseCase.execute(query);
    if (result) return res.status(200).send(result);
    return res.status(404).send();
  }
}
