import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetItemByIdUseCase } from '@app/inventory/read/hexagon/usecases/get-item-by-id/get-item-by-id.usecase';
import { GetFoldersItemsQuery } from '@app/inventory/read/infra/clients/nestjs/queries/get-folders-items.query';
import { GetItemsInFolderUseCase } from '@app/inventory/read/hexagon/usecases/get-items-in-folder/get-items-in-folder.usecase';

@Controller('items')
export class ReadItemsController {
  constructor(
    private readonly getItemByIdUseCase: GetItemByIdUseCase,
    private readonly getItemsInFolderUseCase: GetItemsInFolderUseCase,
  ) {}
  @Get(':id')
  getItemById(@Param('id') id: string) {
    return this.getItemByIdUseCase.execute({ id });
  }

  @Get()
  getItems(@Query() query: GetFoldersItemsQuery) {
    return this.getItemsInFolderUseCase.execute({ folderId: query.folderId });
  }
}
