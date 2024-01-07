import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateNewItemUseCase } from '@app/inventory/write/hexagon/usecases/create-new-item/create-new-item.usecase';
import { CreateNewItemDto } from '@app/inventory/write/infra/clients/nestjs/dtos/create-new-item.dto';
import { AddTagToItemUseCase } from '@app/inventory/write/hexagon/usecases/add-tag-to-item/add-tag-to-item.usecase';
import { AddTagToItemParams } from '@app/inventory/write/infra/clients/nestjs/params/add-tag-to-item.params';
import { RemoveTagFromItemParams } from '@app/inventory/write/infra/clients/nestjs/params/remove-tag-from-item.params';
import { MoveItemIntoFolderParams } from '@app/inventory/write/infra/clients/nestjs/params/move-item-into-folder.params';
import { MoveItemIntoFolderUseCase } from '@app/inventory/write/hexagon/usecases/move-item-into-folder/move-item-into-folder.usecase';
import { MoveItemIntoFolderDto } from '@app/inventory/write/infra/clients/nestjs/dtos/move-item-into-folder.dto';

@Controller('items')
export class WriteItemsController {
  constructor(
    private readonly createNewItemUseCase: CreateNewItemUseCase,
    private readonly addTagToItemUseCase: AddTagToItemUseCase,
    private readonly removeItemTagUseCase: AddTagToItemUseCase,
    private readonly moveItemIntoFolderUseCase: MoveItemIntoFolderUseCase,
  ) {}

  @Post()
  async createNewItem(@Body() body: CreateNewItemDto) {
    const { id, name, quantity } = body;
    await this.createNewItemUseCase.execute({
      id,
      name,
      quantity,
    });
  }

  @Post(':itemId/tags/:tagId')
  async addTagToItem(@Param() params: AddTagToItemParams) {
    const { itemId, tagId } = params;
    await this.addTagToItemUseCase.execute({ itemId, tagId });
  }

  @Delete(':itemId/tags/:tagId')
  async removeTagFromItem(@Param() params: RemoveTagFromItemParams) {
    const { itemId, tagId } = params;
    await this.removeItemTagUseCase.execute({ itemId, tagId });
  }

  @Post(':itemId/move')
  async moveItemIntoFolder(
    @Param() params: MoveItemIntoFolderParams,
    @Body() body: MoveItemIntoFolderDto,
  ) {
    const { itemId } = params;
    const { folderId } = body;
    await this.moveItemIntoFolderUseCase.execute({ itemId, folderId });
  }
}
