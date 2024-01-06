import { Body, Controller, Post } from '@nestjs/common';
import { CreateNewFolderUseCase } from '@app/inventory/write/hexagon/usecases/create-new-folder/create-new-folder.usecase';
import { CreateNewFolderDto } from '@app/inventory/write/infra/clients/nestjs/dtos/create-new-folder.dto';

@Controller('folders')
export class WriteFoldersController {
  constructor(
    private readonly createNewFolderUseCase: CreateNewFolderUseCase,
  ) {}

  @Post()
  async createNewFolder(@Body() body: CreateNewFolderDto) {
    const { id, name } = body;
    await this.createNewFolderUseCase.execute({
      id,
      name,
    });
  }
}
