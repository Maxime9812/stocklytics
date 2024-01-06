import { InMemoryTagsRepository } from '@app/inventory/write/infra/gateways/repositories/in-memory-tags.repository';
import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/in-memory-auth.gateway';
import { StubDateProvider } from '@app/inventory/write/hexagon/models/date-provider/stub-date.provider';
import {
  CreateNewTagUseCase,
  CreateNewTagUseCasePayload,
} from '@app/inventory/write/hexagon/usecases/create-new-tag/create-new-tag.usecase';
import { Tag } from '@app/inventory/write/hexagon/models/tag';

export const createTagsFixture = ({
  tagsRepository = new InMemoryTagsRepository(),
}: Partial<{
  tagsRepository: InMemoryTagsRepository;
}> = {}) => {
  const authGateway = new InMemoryAuthGateway();
  const dateProvider = new StubDateProvider();
  let createNewTagUseCase: CreateNewTagUseCase;

  return {
    givenNowIs(date: Date) {
      dateProvider.givenNow(date);
    },
    givenCompanyId(companyId: string) {
      authGateway.givenCompanyId(companyId);
    },
    givenTags(...tags: Tag[]) {
      tagsRepository.givenTags(...tags);
    },
    whenCreateNewTag(payload: CreateNewTagUseCasePayload) {
      createNewTagUseCase = new CreateNewTagUseCase(
        tagsRepository,
        dateProvider,
        authGateway,
      );
      return createNewTagUseCase.execute(payload);
    },
    thenTagsShouldBe(...tags: Tag[]) {
      expect(tagsRepository.tags.map((t) => t.snapshot)).toEqual(
        tags.map((t) => t.snapshot),
      );
    },
  };
};

export type TagsFixture = ReturnType<typeof createTagsFixture>;
