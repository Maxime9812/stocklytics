import { Module } from '@nestjs/common';
import { ReadUseCasesModule } from '@app/inventory/read/infra/clients/nestjs/read-usecases.module';
import { ReadItemsController } from '@app/inventory/read/infra/clients/nestjs/controllers/read-items.controller';
import { ReadFoldersController } from '@app/inventory/read/infra/clients/nestjs/controllers/read-folders.controller';
import { ReadScanController } from '@app/inventory/read/infra/clients/nestjs/controllers/read-scan.controller';
import { ReadTagsController } from '@app/inventory/read/infra/clients/nestjs/controllers/read-tags.controller';

@Module({
  imports: [ReadUseCasesModule],
  controllers: [
    ReadItemsController,
    ReadFoldersController,
    ReadScanController,
    ReadTagsController,
  ],
})
export class ReadModule {}
