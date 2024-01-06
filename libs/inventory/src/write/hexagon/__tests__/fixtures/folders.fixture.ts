import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/in-memory-auth.gateway';
import { StubDateProvider } from '@app/inventory/write/hexagon/models/date-provider/stub-date.provider';
import { Folder } from '@app/inventory/write/hexagon/models/folder';
import { InMemoryFoldersRepository } from '@app/inventory/write/infra/gateways/repositories/in-memory-folders.repository';
import {
  CreateNewFolderUseCase,
  CreateNewFolderUseCasePayload,
} from '@app/inventory/write/hexagon/usecases/create-new-folder/create-new-folder.usecase';

export const createFoldersFixture = ({
  authGateway = new InMemoryAuthGateway(),
}: Partial<{
  authGateway: InMemoryAuthGateway;
}> = {}) => {
  const foldersRepository = new InMemoryFoldersRepository();
  const dateProvider = new StubDateProvider();

  return {
    givenNowIs(date: Date) {
      dateProvider.givenNow(date);
    },
    givenFolders(...folders: Folder[]) {
      foldersRepository.givenFolders(...folders);
    },
    whenCreateNewFolder(payload: CreateNewFolderUseCasePayload) {
      return new CreateNewFolderUseCase(
        foldersRepository,
        authGateway,
        dateProvider,
      ).execute(payload);
    },
    thenFoldersShouldBe(...folders: Folder[]) {
      expect(foldersRepository.folders.map((t) => t.snapshot)).toEqual(
        folders.map((t) => t.snapshot),
      );
    },
  };
};

export type FoldersFixture = ReturnType<typeof createFoldersFixture>;
