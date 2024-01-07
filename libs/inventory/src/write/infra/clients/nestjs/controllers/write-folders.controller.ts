import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateNewFolderUseCase } from '@app/inventory/write/hexagon/usecases/create-new-folder/create-new-folder.usecase';
import { CreateNewFolderDto } from '@app/inventory/write/infra/clients/nestjs/dtos/create-new-folder.dto';
import { MoveFolderUseCase } from '@app/inventory/write/hexagon/usecases/move-folder/move-folder.usecase';
import { MoveFolderDto } from '@app/inventory/write/infra/clients/nestjs/dtos/move-folder.dto';
import { MoveFolderParams } from '@app/inventory/write/infra/clients/nestjs/params/move-folder.params';

@Controller('folders')
export class WriteFoldersController {
  constructor(
    private readonly createNewFolderUseCase: CreateNewFolderUseCase,
    private readonly moveFolderUseCase: MoveFolderUseCase,
  ) {}

  @Post()
  async createNewFolder(@Body() body: CreateNewFolderDto) {
    const { id, name } = body;
    await this.createNewFolderUseCase.execute({
      id,
      name,
    });
  }

  @Post(':folderId/move')
  async moveFolder(
    @Param() params: MoveFolderParams,
    @Body() body: MoveFolderDto,
  ) {
    const { folderId } = params;
    const { parentFolderId } = body;
    await this.moveFolderUseCase.execute({
      folderId,
      parentFolderId,
    });
  }
}
