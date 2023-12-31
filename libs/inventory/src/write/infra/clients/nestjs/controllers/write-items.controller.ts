import { Controller, Post } from '@nestjs/common';
import { CreateNewItemUseCase } from '@app/inventory/write/hexagon/usecases/create-new-item/create-new-item.usecase';

@Controller('items')
export class WriteItemsController {
  constructor(private readonly createNewItemUseCase: CreateNewItemUseCase) {}

  @Post()
  async createNewItem() {
    await this.createNewItemUseCase.execute({
      id: '123',
      name: 'Item 1',
      quantity: 1,
      price: 100,
    });
  }
}
