import { ItemsRepository } from '@app/inventory/hexagon/gateways/items.repository';
import { AuthGateway } from '@app/inventory/hexagon/gateways/auth.gateway';
import { Item } from '@app/inventory/hexagon/models/item';
import { DateProvider } from '@app/inventory/hexagon/models/date.provider';

type CreateNewItemUseCasePayload = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export class CreateNewItemUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly authGateway: AuthGateway,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute(payload: CreateNewItemUseCasePayload) {
    const item = Item.create({
      id: payload.id,
      companyId: this.authGateway.getCompanyId(),
      name: payload.name,
      quantity: payload.quantity,
      price: payload.price,
      currentDate: this.dateProvider.getNow(),
    });
    await this.itemsRepository.save(item);
  }
}
