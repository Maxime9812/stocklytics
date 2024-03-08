import { Module } from '@nestjs/common';
import { RealDateProvider } from '@app/inventory/write/hexagon/models/date-provider/real-date.provider';
import { DatabaseModule } from '@app/shared';
import { KnexItemsRepository } from '@app/inventory/write/infra/gateways/repositories/knex/knex-items.repository';
import { Knex } from 'knex';
import { KnexTagsRepository } from '@app/inventory/write/infra/gateways/repositories/knex/knex-tags.repository';
import { KnexFoldersRepository } from '@app/inventory/write/infra/gateways/repositories/knex/knex-folders.repository';
import { LocalDiskStorageImageUploaderGateway } from '@app/inventory/write/infra/gateways/image-uploader/local-disk-storage-image-uploader.gateway';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: 'ItemsRepository',
      inject: ['SqlConnection'],
      useFactory: (sqlConnection: Knex) =>
        new KnexItemsRepository(sqlConnection),
    },
    {
      provide: 'TagsRepository',
      inject: ['SqlConnection'],
      useFactory: (sqlConnection: Knex) =>
        new KnexTagsRepository(sqlConnection),
    },
    {
      provide: 'FoldersRepository',
      inject: ['SqlConnection'],
      useFactory: (sqlConnection: Knex) =>
        new KnexFoldersRepository(sqlConnection),
    },
    {
      provide: 'DateProvider',
      useClass: RealDateProvider,
    },
    {
      provide: 'ImageUploaderGateway',
      useFactory: () =>
        new LocalDiskStorageImageUploaderGateway(
          'http://192.168.5.63:3000/images/',
          `public/images`,
        ),
    },
  ],
  exports: [
    'ItemsRepository',
    'DateProvider',
    'TagsRepository',
    'FoldersRepository',
    'ImageUploaderGateway',
  ],
})
export class WriteGatewaysModule {}
