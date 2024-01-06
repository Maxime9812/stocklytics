import { InMemoryItemsRepository } from '@app/inventory/write/infra/gateways/repositories/in-memory-items.repository';
import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/in-memory-auth.gateway';
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

export const createItemsFixture = ({
  tagsRepository = new InMemoryTagsRepository(),
}: Partial<{
  tagsRepository: InMemoryTagsRepository;
}> = {}) => {
  const itemsRepository = new InMemoryItemsRepository();
  const authGateway = new InMemoryAuthGateway();
  const dateProvider = new StubDateProvider();

  return {
    givenNowIs(date: Date) {
      dateProvider.givenNow(date);
    },
    givenCompanyId(companyId: string) {
      authGateway.givenCompanyId(companyId);
    },
    givenItems(...items: Item[]) {
      itemsRepository.givenItems(...items);
    },
    whenCreateNewItem(payload: CreateNewItemUseCasePayload) {
      return new CreateNewItemUseCase(
        itemsRepository,
        authGateway,
        dateProvider,
      ).execute(payload);
    },
    whenAddTagToItem(payload: AddTagToItemUseCasePayload) {
      return new AddTagToItemUseCase(tagsRepository, itemsRepository).execute(
        payload,
      );
    },
    thenItemsShouldBe(...items: Item[]) {
      expect(itemsRepository.items.map((t) => t.snapshot)).toEqual(
        items.map((t) => t.snapshot),
      );
    },
  };
};

export type ItemsFixture = ReturnType<typeof createItemsFixture>;
