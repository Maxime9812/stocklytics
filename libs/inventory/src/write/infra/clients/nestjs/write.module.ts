import { Module } from '@nestjs/common';
import { WriteItemsController } from '@app/inventory/write/infra/clients/nestjs/controllers/write-items.controller';
import { WriteUseCasesModule } from '@app/inventory/write/infra/clients/nestjs/write-usecases.module';
import { WriteTagsController } from '@app/inventory/write/infra/clients/nestjs/controllers/write-tags.controller';
import { WriteFoldersController } from '@app/inventory/write/infra/clients/nestjs/controllers/write-folders.controller';

@Module({
  imports: [WriteUseCasesModule],
  controllers: [
    WriteItemsController,
    WriteTagsController,
    WriteFoldersController,
  ],
})
export class WriteModule {}
