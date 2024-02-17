import {
  createItemsFixture,
  ItemsFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/items.fixture';
import { itemBuilder } from '@app/inventory/write/hexagon/__tests__/builders/item.builder';
import { DroppingTransactionPerformer } from '@app/shared/transaction-performing/dropping-transaction-performer';
import { BarcodeAlreadyLinkedToAnotherItemError } from '@app/inventory/write/hexagon/usecases/link-barcode-to-item/link-barcode-to-item.usecase';
import {
  AuthFixture,
  createAuthFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/auth.fixture';
import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/in-memory-auth.gateway';

describe('Feature: Link barcode to item', () => {
  let fixture: ItemsFixture;
  let authFixture: AuthFixture;

  beforeEach(() => {
    const authGateway = new InMemoryAuthGateway();
    fixture = createItemsFixture({ authGateway });
    authFixture = createAuthFixture({ authGateway });
    authFixture.givenAuthUser({
      id: 'user-id',
      companyId: 'company-id',
    });
  });

  test('Barcode is linked to item', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id');
    fixture.givenItems(initialItemBuilder.build());

    await fixture.whenLinkBarcodeToItem({
      itemId: 'item-id',
      barcode: {
        type: 'ean13',
        value: '1234567890102',
      },
    });

    fixture.thenItemsShouldBe(
      initialItemBuilder
        .withBarcode({
          type: 'ean13',
          value: '1234567890102',
        })
        .build(),
    );
  });

  test('Can NOT link barcode to item if another item are already linked to the barcode', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id');
    const anotherItemBuilder = itemBuilder()
      .withId('another-item-id')
      .withCompanyId('company-id')
      .withBarcode({ type: 'ean13', value: '1234567890102' });
    fixture.givenItems(initialItemBuilder.build(), anotherItemBuilder.build());

    await fixture.whenLinkBarcodeToItem({
      itemId: 'item-id',
      barcode: {
        type: 'ean13',
        value: '1234567890102',
      },
    });

    fixture.thenErrorShouldBe(
      new BarcodeAlreadyLinkedToAnotherItemError('another-item-id'),
    );
  });

  test('Make transactional the process of linking barcode to item', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id');
    fixture.givenItems(initialItemBuilder.build());

    fixture.givenTransactionPerformer(new DroppingTransactionPerformer());

    await fixture.whenLinkBarcodeToItem({
      itemId: 'item-id',
      barcode: {
        type: 'ean13',
        value: '1234567890102',
      },
    });

    fixture.thenItemsShouldBe(initialItemBuilder.build());
  });
});
