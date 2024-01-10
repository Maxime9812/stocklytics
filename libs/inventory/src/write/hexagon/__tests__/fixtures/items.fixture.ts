import { InMemoryItemsRepository } from '@app/inventory/write/infra/gateways/repositories/in-memory-items.repository';
import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/in-memory-auth.gateway';
import { StubDateProvider } from '@app/inventory/write/hexagon/models/date-provider/stub-date.provider';
import {
  CreateNewItemUseCase,
  CreateNewItemUseCasePayload,
} from '@app/inventory/write/hexagon/usecases/create-new-item/create-new-item.usecase';
import { Item } from '@app/inventory/write/hexagon/models/item';
import { InMemoryTagsRepository } from '@app/inventory/write/infra/gateways/repositories/in-memory-tags.repository';
import {
  AddTagToItemUseCase,
  AddTagToItemUseCasePayload,
} from '@app/inventory/write/hexagon/usecases/add-tag-to-item/add-tag-to-item.usecase';
import {
  MoveItemIntoFolderUseCase,
  MoveItemIntoFolderUseCasePayload,
} from '@app/inventory/write/hexagon/usecases/move-item-into-folder/move-item-into-folder.usecase';
import { InMemoryFoldersRepository } from '@app/inventory/write/infra/gateways/repositories/in-memory-folders.repository';
import {
  RemoveItemTagUseCase,
  RemoveItemTagUseCasePayload,
} from '@app/inventory/write/hexagon/usecases/remove-item-tag/remove-item-tag.usecase';
import { NullTransformationPerformer } from '@app/shared/transaction-performing/null-transaction-performer';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';

export const createItemsFixture = ({
  tagsRepository = new InMemoryTagsRepository(),
  foldersRepository = new InMemoryFoldersRepository(),
  authGateway = new InMemoryAuthGateway(),
}: Partial<{
  tagsRepository: InMemoryTagsRepository;
  foldersRepository: InMemoryFoldersRepository;
  authGateway: InMemoryAuthGateway;
}> = {}) => {
  const itemsRepository = new InMemoryItemsRepository();
  const dateProvider = new StubDateProvider();
  let transactionPerformer: TransactionPerformer =
    new NullTransformationPerformer();

  return {
    givenNowIs(date: Date) {
      dateProvider.givenNow(date);
    },
    givenItems(...items: Item[]) {
      itemsRepository.givenItems(...items);
    },
    givenTransactionPerformer(_transactionPerformer: TransactionPerformer) {
      transactionPerformer = _transactionPerformer;
    },
    whenCreateNewItem(payload: CreateNewItemUseCasePayload) {
      return new CreateNewItemUseCase(
        itemsRepository,
        authGateway,
        dateProvider,
        transactionPerformer,
      ).execute(payload);
    },
    whenAddTagToItem(payload: AddTagToItemUseCasePayload) {
      return new AddTagToItemUseCase(
        tagsRepository,
        itemsRepository,
        transactionPerformer,
      ).execute(payload);
    },
    whenMoveItemToFolder(payload: MoveItemIntoFolderUseCasePayload) {
      return new MoveItemIntoFolderUseCase(
        itemsRepository,
        foldersRepository,
        transactionPerformer,
      ).execute(payload);
    },
    whenRemoveItemTag(payload: RemoveItemTagUseCasePayload) {
      return new RemoveItemTagUseCase(
        itemsRepository,
        transactionPerformer,
      ).execute(payload);
    },
    thenItemsShouldBe(...items: Item[]) {
      expect(itemsRepository.items.map((t) => t.snapshot)).toEqual(
        items.map((t) => t.snapshot),
      );
    },
    thenItemsShouldBeEmpty() {
      expect(itemsRepository.items).toEqual([]);
    },
  };
};

export type ItemsFixture = ReturnType<typeof createItemsFixture>;
