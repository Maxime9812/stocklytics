import { Controller, Get, Param } from '@nestjs/common';
import { GetItemsInFolderUseCase } from '@app/inventory/read/hexagon/usecases/get-items-in-folder/get-items-in-folder.usecase';

@Controller('folders')
export class ReadFoldersController {
  constructor(
    private readonly getItemsInFolderUseCase: GetItemsInFolderUseCase,
  ) {}

  @Get(':id/items')
  getItemsInFolder(@Param('id') id: string) {
    return this.getItemsInFolderUseCase.execute({ folderId: id });
  }

  @Get('/items')
  getItemsInRootFolder() {
    return this.getItemsInFolderUseCase.execute({});
  }
}
