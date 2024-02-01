import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { DateProvider } from '@app/inventory/write/hexagon/models/date-provider/date.provider';
import { Item } from '@app/inventory/write/hexagon/models/item';
import { AuthGateway } from '@app/authentication';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';

export type CreateNewItemUseCasePayload = {
  id: string;
  name: string;
  quantity: number;
  folderId?: string;
};

export class CreateNewItemUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly authGateway: AuthGateway,
    private readonly dateProvider: DateProvider,
    private readonly transactionPerformer: TransactionPerformer,
  ) {}

  async execute(payload: CreateNewItemUseCasePayload) {
    await this.transactionPerformer.perform(async (trx) => {
      const currentUser = this.authGateway.currentUser();

      const item = Item.create({
        id: payload.id,
        companyId: currentUser.companyId,
        name: payload.name,
        quantity: payload.quantity,
        currentDate: this.dateProvider.getNow(),
        folderId: payload.folderId,
      });
      await this.itemsRepository.save(item)(trx);
    });
  }
}
