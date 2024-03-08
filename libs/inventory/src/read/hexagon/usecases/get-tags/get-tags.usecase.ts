import { AuthGateway } from '@app/authentication';
import { GetTagsQuery } from '@app/inventory/read/hexagon/queries/get-tags.query';

export class GetTagsUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly getTagsQuery: GetTagsQuery,
  ) {}

  async execute() {
    return this.getTagsQuery.execute(this.authGateway.currentUser().companyId);
  }
}
