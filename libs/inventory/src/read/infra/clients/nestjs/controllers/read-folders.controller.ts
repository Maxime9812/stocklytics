import { Controller, Get, Query } from '@nestjs/common';
import { GetFoldersInFoldersUseCase } from '@app/inventory/read/hexagon/usecases/get-folders-in-folders/get-folders-in-folders.usecase';
import { GetFoldersItemsQuery } from '@app/inventory/read/infra/clients/nestjs/queries/get-folders-items.query';

@Controller('folders')
export class ReadFoldersController {
  constructor(
    private readonly getFoldersInFoldersUseCase: GetFoldersInFoldersUseCase,
  ) {}

  @Get()
  getFoldersInFolders(@Query() query: GetFoldersItemsQuery) {
    return this.getFoldersInFoldersUseCase.execute({
      folderId: query.folderId,
    });
  }
}
