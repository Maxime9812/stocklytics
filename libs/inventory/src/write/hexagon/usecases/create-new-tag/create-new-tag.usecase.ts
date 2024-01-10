import { TagsRepository } from '@app/inventory/write/hexagon/gateways/repositories/tags.repository';
import { DateProvider } from '@app/inventory/write/hexagon/models/date-provider/date.provider';
import { Tag } from '@app/inventory/write/hexagon/models/tag';
import { AuthGateway } from '@app/authentication';

export type CreateNewTagUseCasePayload = {
  id: string;
  name: string;
};
export class CreateNewTagUseCase {
  constructor(
    private readonly tagsRepository: TagsRepository,
    private readonly dateProvider: DateProvider,
    private readonly authGateway: AuthGateway,
  ) {}
  async execute({ id, name }: CreateNewTagUseCasePayload) {
    const currentUser = this.authGateway.currentUser();

    const tagWithSameNameExists =
      await this.tagsRepository.tagWithNameExists(name);

    if (tagWithSameNameExists) return;

    const tag = Tag.create({
      id,
      name,
      companyId: currentUser.companyId,
      currentDate: this.dateProvider.getNow(),
    });

    await this.tagsRepository.save(tag);
  }
}
