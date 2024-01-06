import { InMemoryItemsRepository } from '@app/inventory/write/infra/gateways/repositories/in-memory-items.repository';
import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/in-memory-auth.gateway';
import { StubDateProvider } from '@app/inventory/write/hexagon/models/date-provider/stub-date.provider';
import {
  CreateNewItemUseCase,
  CreateNewItemUseCasePayload,
} from '@app/inventory/write/hexagon/usecases/create-new-item/create-new-item.usecase';
import { Item } from '@app/inventory/write/hexagon/models/item';

export const createItemsFixture = () => {
  const itemsRepository = new InMemoryItemsRepository();
  const authGateway = new InMemoryAuthGateway();
  const dateProvider = new StubDateProvider();
  let createNewItemUseCase: CreateNewItemUseCase;

  return {
    givenNowIs(date: Date) {
      dateProvider.givenNow(date);
    },
    givenCompanyId(companyId: string) {
      authGateway.givenCompanyId(companyId);
    },
    whenCreateNewItem(payload: CreateNewItemUseCasePayload) {
      createNewItemUseCase = new CreateNewItemUseCase(
        itemsRepository,
        authGateway,
        dateProvider,
      );
      return createNewItemUseCase.execute(payload);
    },
    thenItemsShouldBe(...items: Item[]) {
      expect(itemsRepository.items.map((t) => t.snapshot)).toEqual(
        items.map((t) => t.snapshot),
      );
    },
  };
};

export type ItemsFixture = ReturnType<typeof createItemsFixture>;
