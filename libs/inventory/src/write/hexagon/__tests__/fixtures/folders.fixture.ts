import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/in-memory-auth.gateway';
import { StubDateProvider } from '@app/inventory/write/hexagon/models/date-provider/stub-date.provider';
import { Folder } from '@app/inventory/write/hexagon/models/folder';
import { InMemoryFoldersRepository } from '@app/inventory/write/infra/gateways/repositories/in-memory-folders.repository';
import {
  CreateNewFolderUseCase,
  CreateNewFolderUseCasePayload,
} from '@app/inventory/write/hexagon/usecases/create-new-folder/create-new-folder.usecase';
import {
  MoveFolderUseCase,
  MoveFolderUseCasePayload,
} from '@app/inventory/write/hexagon/usecases/move-folder/move-folder.usecase';
import {
  DeleteFolderUseCase,
  DeleteFolderUseCasePayload,
} from '@app/inventory/write/hexagon/usecases/delete-folder/delete-folder.usecase';

export const createFoldersFixture = ({
  authGateway = new InMemoryAuthGateway(),
  foldersRepository = new InMemoryFoldersRepository(),
}: Partial<{
  authGateway: InMemoryAuthGateway;
  foldersRepository: InMemoryFoldersRepository;
}> = {}) => {
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
    whenMoveFolder(payload: MoveFolderUseCasePayload) {
      return new MoveFolderUseCase(foldersRepository).execute(payload);
    },
    whenDeleteFolder(payload: DeleteFolderUseCasePayload) {
      return new DeleteFolderUseCase(foldersRepository).execute(payload);
    },
    thenFoldersShouldBe(...folders: Folder[]) {
      expect(foldersRepository.folders.map((t) => t.snapshot)).toEqual(
        folders.map((t) => t.snapshot),
      );
    },
    thenFoldersShouldBeEmpty() {
      expect(foldersRepository.folders).toEqual([]);
    },
  };
};

export type FoldersFixture = ReturnType<typeof createFoldersFixture>;
