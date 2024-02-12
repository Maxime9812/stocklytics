import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateNewFolderUseCase } from '@app/inventory/write/hexagon/usecases/create-new-folder/create-new-folder.usecase';
import { CreateNewFolderDto } from '@app/inventory/write/infra/clients/nestjs/dtos/create-new-folder.dto';
import { MoveFolderUseCase } from '@app/inventory/write/hexagon/usecases/move-folder/move-folder.usecase';
import { MoveFolderDto } from '@app/inventory/write/infra/clients/nestjs/dtos/move-folder.dto';
import { MoveFolderParams } from '@app/inventory/write/infra/clients/nestjs/params/move-folder.params';
import { GetFolderByIdUseCase } from '@app/inventory/read/hexagon/usecases/get-folder-by-id/get-folder-by-id.usecase';
import { DeleteFolderUseCase } from '@app/inventory/write/hexagon/usecases/delete-folder/delete-folder.usecase';
import { FolderParams } from '@app/inventory/write/infra/clients/nestjs/params/folder.params';

@Controller('folders')
export class WriteFoldersController {
  constructor(
    private readonly createNewFolderUseCase: CreateNewFolderUseCase,
    private readonly moveFolderUseCase: MoveFolderUseCase,
    private readonly getFolderByIdUseCase: GetFolderByIdUseCase,
    private readonly deleteFolderUseCase: DeleteFolderUseCase,
  ) {}

  @Post()
  async createNewFolder(@Body() body: CreateNewFolderDto) {
    const { id } = body;
    await this.createNewFolderUseCase.execute(body);
    return this.getFolderByIdUseCase.execute(id);
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

  @Delete(':folderId')
  async deleteFolder(@Param() params: FolderParams) {
    const { folderId } = params;
    await this.deleteFolderUseCase.execute({ folderId });
  }
}
