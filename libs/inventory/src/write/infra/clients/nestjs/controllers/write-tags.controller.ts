import { Body, Controller, Post } from '@nestjs/common';
import { CreateNewTagUseCase } from '@app/inventory/write/hexagon/usecases/create-new-tag/create-new-tag.usecase';
import { CreateNewTagDto } from '@app/inventory/write/infra/clients/nestjs/dtos/create-new-tag.dto';

@Controller('tags')
export class WriteTagsController {
  constructor(private readonly createNewTagUseCase: CreateNewTagUseCase) {}
  @Post()
  async createNewTag(@Body() body: CreateNewTagDto) {
    const { id, name } = body;
    await this.createNewTagUseCase.execute({
      id,
      name,
    });
  }
}
