import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateNewItemUseCase } from '@app/inventory/write/hexagon/usecases/create-new-item/create-new-item.usecase';
import { CreateNewItemDto } from '@app/inventory/write/infra/clients/nestjs/dtos/create-new-item.dto';
import { AddTagToItemUseCase } from '@app/inventory/write/hexagon/usecases/add-tag-to-item/add-tag-to-item.usecase';
import { AddTagToItemParams } from '@app/inventory/write/infra/clients/nestjs/params/add-tag-to-item.params';
import { RemoveTagFromItemParams } from '@app/inventory/write/infra/clients/nestjs/params/remove-tag-from-item.params';
import { MoveItemIntoFolderParams } from '@app/inventory/write/infra/clients/nestjs/params/move-item-into-folder.params';
import { MoveItemIntoFolderUseCase } from '@app/inventory/write/hexagon/usecases/move-item-into-folder/move-item-into-folder.usecase';
import { MoveItemIntoFolderDto } from '@app/inventory/write/infra/clients/nestjs/dtos/move-item-into-folder.dto';
import { RemoveItemTagUseCase } from '@app/inventory/write/hexagon/usecases/remove-item-tag/remove-item-tag.usecase';
import { GetItemByIdUseCase } from '@app/inventory/read/hexagon/usecases/get-item-by-id/get-item-by-id.usecase';
import { LinkBarcodeToItemUseCase } from '@app/inventory/write/hexagon/usecases/link-barcode-to-item/link-barcode-to-item.usecase';
import { LinkBarcodeToItemDto } from '@app/inventory/write/infra/clients/nestjs/dtos/link-barcode-to-item.dto';
import { ItemParams } from '@app/inventory/write/infra/clients/nestjs/params/item.params';
import { EditItemNoteDto } from '@app/inventory/write/infra/clients/nestjs/dtos/edit-item-note.dto';
import { EditItemNoteUseCase } from '@app/inventory/write/hexagon/usecases/edit-item-note/edit-item-note.usecase';
import { DeleteItemUseCase } from '@app/inventory/write/hexagon/usecases/delete-item/delete-item.usecase';

@Controller('items')
export class WriteItemsController {
  constructor(
    private readonly createNewItemUseCase: CreateNewItemUseCase,
    private readonly addTagToItemUseCase: AddTagToItemUseCase,
    private readonly removeItemTagUseCase: RemoveItemTagUseCase,
    private readonly moveItemIntoFolderUseCase: MoveItemIntoFolderUseCase,
    private readonly getItemByIdUseCase: GetItemByIdUseCase,
    private readonly linkBarcodeToItemUseCase: LinkBarcodeToItemUseCase,
    private readonly editItemNoteUseCase: EditItemNoteUseCase,
    private readonly deleteItemUseCase: DeleteItemUseCase,
  ) {}

  @Post()
  async createNewItem(@Body() body: CreateNewItemDto) {
    await this.createNewItemUseCase.execute(body);
    return this.getItemByIdUseCase.execute({ id: body.id });
  }

  @Post(':itemId/tags/:tagId')
  async addTagToItem(@Param() params: AddTagToItemParams) {
    await this.addTagToItemUseCase.execute(params);
  }

  @Delete(':itemId/tags/:tagId')
  async removeTagFromItem(@Param() params: RemoveTagFromItemParams) {
    await this.removeItemTagUseCase.execute(params);
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

  @Post(':itemId/barcode')
  async linkBarcodeToItem(
    @Param() params: ItemParams,
    @Body() body: LinkBarcodeToItemDto,
  ) {
    const { barcode } = body;
    const { itemId } = params;

    await this.linkBarcodeToItemUseCase.execute({
      itemId,
      barcode,
    });
  }

  @Post(':itemId/note')
  async editItemNote(
    @Param() params: ItemParams,
    @Body() body: EditItemNoteDto,
  ) {
    const { note } = body;
    const { itemId } = params;

    await this.editItemNoteUseCase.execute({
      itemId,
      note,
    });
  }

  @Delete(':itemId')
  async deleteItem(@Param() params: ItemParams) {
    const { itemId } = params;
    await this.deleteItemUseCase.execute({ itemId });
  }
}
