import { Controller, Get, Param } from '@nestjs/common';
import { GetItemByIdUseCase } from '@app/inventory/read/hexagon/usecases/get-item-by-id/get-item-by-id.usecase';

@Controller('items')
export class ReadItemsController {
  constructor(private readonly getItemByIdUseCase: GetItemByIdUseCase) {}
  @Get(':id')
  getItemById(@Param('id') id: string) {
    return this.getItemByIdUseCase.execute({ id });
  }
}
