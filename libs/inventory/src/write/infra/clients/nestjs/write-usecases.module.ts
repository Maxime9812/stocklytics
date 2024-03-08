import { Module } from '@nestjs/common';
import { CreateNewItemUseCase } from '@app/inventory/write/hexagon/usecases/create-new-item/create-new-item.usecase';
import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { DateProvider } from '@app/inventory/write/hexagon/models/date-provider/date.provider';
import { WriteGatewaysModule } from '@app/inventory/write/infra/clients/nestjs/write-gateways.module';
import { AuthGateway } from '@app/authentication/hexagon/gateways/auth.gateway';
import { AuthGatewaysModule } from '@app/authentication/infra/clients/nestjs/auth-gateways.module';
import { AddTagToItemUseCase } from '@app/inventory/write/hexagon/usecases/add-tag-to-item/add-tag-to-item.usecase';
import { TagsRepository } from '@app/inventory/write/hexagon/gateways/repositories/tags.repository';
import { RemoveItemTagUseCase } from '@app/inventory/write/hexagon/usecases/remove-item-tag/remove-item-tag.usecase';
import { CreateNewFolderUseCase } from '@app/inventory/write/hexagon/usecases/create-new-folder/create-new-folder.usecase';
import { FoldersRepository } from '@app/inventory/write/hexagon/gateways/repositories/folders.repository';
import { CreateNewTagUseCase } from '@app/inventory/write/hexagon/usecases/create-new-tag/create-new-tag.usecase';
import { MoveItemIntoFolderUseCase } from '@app/inventory/write/hexagon/usecases/move-item-into-folder/move-item-into-folder.usecase';
import { MoveFolderUseCase } from '@app/inventory/write/hexagon/usecases/move-folder/move-folder.usecase';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';
import { DatabaseModule } from '@app/shared';
import { LinkBarcodeToItemUseCase } from '@app/inventory/write/hexagon/usecases/link-barcode-to-item/link-barcode-to-item.usecase';
import { EditItemNoteUseCase } from '@app/inventory/write/hexagon/usecases/edit-item-note/edit-item-note.usecase';
import { DeleteItemUseCase } from '@app/inventory/write/hexagon/usecases/delete-item/delete-item.usecase';
import { DeleteFolderUseCase } from '@app/inventory/write/hexagon/usecases/delete-folder/delete-folder.usecase';
import { UnlinkItemBarcodeUseCase } from '@app/inventory/write/hexagon/usecases/unlink-item-barcode/unlink-item-barcode-use.case';
import { ChangeItemNameUseCase } from '@app/inventory/write/hexagon/usecases/change-item-name/change-item-name.usecase';
import { AdjustItemQuantityUseCase } from '@app/inventory/write/hexagon/usecases/adjust-item-quantity/adjust-item-quantity.usecase';
import { AddImageToItemUseCase } from '@app/inventory/write/hexagon/usecases/add-image-to-item/add-image-to-item.usecase';
import { ImageUploaderGateway } from '@app/inventory/write/hexagon/gateways/image-uploader.gateway';
import { DeleteItemImageUseCase } from '@app/inventory/write/hexagon/usecases/delete-item-image/delete-item-image.usecase';
import { SetItemTagsUseCase } from '@app/inventory/write/hexagon/usecases/set-item-tags/set-item-tags.usecase';

@Module({
  imports: [WriteGatewaysModule, AuthGatewaysModule, DatabaseModule],
  providers: [
    {
      provide: CreateNewItemUseCase,
      inject: [
        'ItemsRepository',
        'AuthGateway',
        'DateProvider',
        'TransactionPerformer',
      ],
      useFactory: (
        itemsRepository: ItemsRepository,
        authGateway: AuthGateway,
        dateProvider: DateProvider,
        transactionPerformer: TransactionPerformer,
      ) => {
        return new CreateNewItemUseCase(
          itemsRepository,
          authGateway,
          dateProvider,
          transactionPerformer,
        );
      },
    },
    {
      provide: AddTagToItemUseCase,
      inject: ['ItemsRepository', 'TagsRepository', 'TransactionPerformer'],
      useFactory: (
        itemsRepository: ItemsRepository,
        tagsRepository: TagsRepository,
        transactionPerformer: TransactionPerformer,
      ) => {
        return new AddTagToItemUseCase(
          tagsRepository,
          itemsRepository,
          transactionPerformer,
        );
      },
    },
    {
      provide: SetItemTagsUseCase,
      inject: ['ItemsRepository', 'TransactionPerformer'],
      useFactory: (
        itemsRepository: ItemsRepository,
        transactionPerformer: TransactionPerformer,
      ) => {
        return new SetItemTagsUseCase(itemsRepository, transactionPerformer);
      },
    },
    {
      provide: RemoveItemTagUseCase,
      inject: ['ItemsRepository', 'TransactionPerformer'],
      useFactory: (
        itemsRepository: ItemsRepository,
        transactionPerformer: TransactionPerformer,
      ) => {
        return new RemoveItemTagUseCase(itemsRepository, transactionPerformer);
      },
    },
    {
      provide: CreateNewFolderUseCase,
      inject: ['FoldersRepository', 'AuthGateway', 'DateProvider'],
      useFactory: (
        foldersRepository: FoldersRepository,
        authGateway: AuthGateway,
        dateProvider: DateProvider,
      ) => {
        return new CreateNewFolderUseCase(
          foldersRepository,
          authGateway,
          dateProvider,
        );
      },
    },
    {
      provide: CreateNewTagUseCase,
      inject: ['TagsRepository', 'AuthGateway', 'DateProvider'],
      useFactory: (
        tagsRepository: TagsRepository,
        authGateway: AuthGateway,
        dateProvider: DateProvider,
      ) => {
        return new CreateNewTagUseCase(
          tagsRepository,
          dateProvider,
          authGateway,
        );
      },
    },
    {
      provide: MoveItemIntoFolderUseCase,
      inject: ['ItemsRepository', 'FoldersRepository', 'TransactionPerformer'],
      useFactory: (
        itemsRepository: ItemsRepository,
        foldersRepository: FoldersRepository,
        transactionPerformer: TransactionPerformer,
      ) => {
        return new MoveItemIntoFolderUseCase(
          itemsRepository,
          foldersRepository,
          transactionPerformer,
        );
      },
    },
    {
      provide: MoveFolderUseCase,
      inject: ['FoldersRepository'],
      useFactory: (foldersRepository: FoldersRepository) => {
        return new MoveFolderUseCase(foldersRepository);
      },
    },
    {
      provide: LinkBarcodeToItemUseCase,
      inject: ['ItemsRepository', 'TransactionPerformer', 'AuthGateway'],
      useFactory: (
        itemsRepository: ItemsRepository,
        transactionPerformer: TransactionPerformer,
        authGateway: AuthGateway,
      ) => {
        return new LinkBarcodeToItemUseCase(
          itemsRepository,
          transactionPerformer,
          authGateway,
        );
      },
    },
    {
      provide: EditItemNoteUseCase,
      inject: ['ItemsRepository', 'TransactionPerformer'],
      useFactory: (
        itemsRepository: ItemsRepository,
        transactionPerformer: TransactionPerformer,
      ) => {
        return new EditItemNoteUseCase(itemsRepository, transactionPerformer);
      },
    },
    {
      provide: DeleteItemUseCase,
      inject: ['ItemsRepository', 'TransactionPerformer'],
      useFactory: (
        itemsRepository: ItemsRepository,
        transactionPerformer: TransactionPerformer,
      ) => {
        return new DeleteItemUseCase(itemsRepository, transactionPerformer);
      },
    },
    {
      provide: DeleteFolderUseCase,
      inject: ['FoldersRepository'],
      useFactory: (foldersRepository: FoldersRepository) => {
        return new DeleteFolderUseCase(foldersRepository);
      },
    },
    {
      provide: UnlinkItemBarcodeUseCase,
      inject: ['ItemsRepository', 'TransactionPerformer'],
      useFactory: (
        itemsRepository: ItemsRepository,
        transactionPerformer: TransactionPerformer,
      ) => {
        return new UnlinkItemBarcodeUseCase(
          itemsRepository,
          transactionPerformer,
        );
      },
    },
    {
      provide: ChangeItemNameUseCase,
      inject: ['ItemsRepository', 'TransactionPerformer'],
      useFactory: (
        itemsRepository: ItemsRepository,
        transactionPerformer: TransactionPerformer,
      ) => {
        return new ChangeItemNameUseCase(itemsRepository, transactionPerformer);
      },
    },
    {
      provide: AdjustItemQuantityUseCase,
      inject: ['ItemsRepository', 'TransactionPerformer'],
      useFactory: (
        itemsRepository: ItemsRepository,
        transactionPerformer: TransactionPerformer,
      ) => {
        return new AdjustItemQuantityUseCase(
          itemsRepository,
          transactionPerformer,
        );
      },
    },
    {
      provide: AddImageToItemUseCase,
      inject: [
        'ItemsRepository',
        'TransactionPerformer',
        'ImageUploaderGateway',
      ],
      useFactory: (
        itemsRepository: ItemsRepository,
        transactionPerformer: TransactionPerformer,
        imageUploader: ImageUploaderGateway,
      ) => {
        return new AddImageToItemUseCase(
          itemsRepository,
          transactionPerformer,
          imageUploader,
        );
      },
    },
    {
      provide: DeleteItemImageUseCase,
      inject: [
        'ItemsRepository',
        'TransactionPerformer',
        'ImageUploaderGateway',
      ],
      useFactory: (
        itemsRepository: ItemsRepository,
        transactionPerformer: TransactionPerformer,
        imageUploader: ImageUploaderGateway,
      ) => {
        return new DeleteItemImageUseCase(
          itemsRepository,
          transactionPerformer,
          imageUploader,
        );
      },
    },
  ],
  exports: [
    CreateNewItemUseCase,
    AddTagToItemUseCase,
    RemoveItemTagUseCase,
    CreateNewFolderUseCase,
    CreateNewTagUseCase,
    MoveItemIntoFolderUseCase,
    MoveFolderUseCase,
    LinkBarcodeToItemUseCase,
    EditItemNoteUseCase,
    DeleteItemUseCase,
    DeleteFolderUseCase,
    UnlinkItemBarcodeUseCase,
    ChangeItemNameUseCase,
    AdjustItemQuantityUseCase,
    AddImageToItemUseCase,
    DeleteItemImageUseCase,
    SetItemTagsUseCase,
  ],
})
export class WriteUseCasesModule {}
