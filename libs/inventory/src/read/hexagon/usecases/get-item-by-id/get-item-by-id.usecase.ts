import { GetItemByIdQuery } from '@app/inventory/read/hexagon/queries/get-item-by-id.query';
import { AuthGateway } from '@app/authentication';

export type GetItemByIdUseCasePayload = {
  id: string;
};
export class GetItemByIdUseCase {
  constructor(
    private readonly getItemByIdQuery: GetItemByIdQuery,
    private readonly authGateway: AuthGateway,
  ) {}
  async execute({ id }: GetItemByIdUseCasePayload) {
    const authUser = this.authGateway.currentUser();

    const item = await this.getItemByIdQuery.execute(id);

    return authUser.companyId == item?.companyId ? item : undefined;
  }
}
