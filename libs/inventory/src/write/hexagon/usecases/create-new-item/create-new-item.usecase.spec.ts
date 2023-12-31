import { InMemoryItemsRepository } from '@app/inventory/infra/gateways/in-memory-items.repository';
import { CreateNewItemUseCase } from '@app/inventory/hexagon/usecases/create-new-item/create-new-item.usecase';
import { InMemoryAuthGateway } from '@app/inventory/infra/gateways/in-memory-auth.gateway';
import { StubDateProvider } from '@app/inventory/hexagon/models/date-provider/stub-date.provider';

describe('Feature: Create new item', () => {
  test('Scenario: Item is created', async () => {
    const itemsRepository = new InMemoryItemsRepository();
    const authGateway = new InMemoryAuthGateway();
    authGateway.givenCompanyId('company-id');
    const dateProvider = new StubDateProvider();
    dateProvider.givenNow(new Date('2023-12-23'));
    const createNewItemUseCase = new CreateNewItemUseCase(
      itemsRepository,
      authGateway,
      dateProvider,
    );
    await createNewItemUseCase.execute({
      id: 'item-id',
      name: 'Iphone 13 pro max',
      quantity: 1,
      price: 1400,
    });
    expect(itemsRepository.items).toEqual([
      {
        id: 'item-id',
        name: 'Iphone 13 pro max',
        companyId: 'company-id',
        quantity: 1,
        price: 1400,
        createdAt: new Date('2023-12-23'),
      },
    ]);
  });
});
