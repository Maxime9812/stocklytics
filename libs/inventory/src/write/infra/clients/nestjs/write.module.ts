import { Module } from '@nestjs/common';
import { WriteItemsController } from '@app/inventory/write/infra/clients/nestjs/controllers/write-items.controller';
import { WriteUseCasesModule } from '@app/inventory/write/infra/clients/nestjs/write-usecases.module';
import { WriteTagsController } from '@app/inventory/write/infra/clients/nestjs/controllers/write-tags.controller';
import { WriteFoldersController } from '@app/inventory/write/infra/clients/nestjs/controllers/write-folders.controller';
import { ReadUseCasesModule } from '@app/inventory/read/infra/clients/nestjs/read-usecases.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Module({
  imports: [
    WriteUseCasesModule,
    ReadUseCasesModule,
    MulterModule.register({
      storage: diskStorage({
        filename: function (req, file, cb) {
          cb(null, `${Date.now()}_${path.extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [
    WriteItemsController,
    WriteTagsController,
    WriteFoldersController,
  ],
})
export class WriteModule {}
