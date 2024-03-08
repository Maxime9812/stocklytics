import { Controller, Get } from '@nestjs/common';
import { GetTagsUseCase } from '@app/inventory/read/hexagon/usecases/get-tags/get-tags.usecase';

@Controller('tags')
export class ReadTagsController {
  constructor(private readonly getTagsUseCase: GetTagsUseCase) {}

  @Get('/')
  getTags() {
    return this.getTagsUseCase.execute();
  }
}
