import { Module } from '@nestjs/common';
import { ReadGatewaysModule } from '@app/inventory/read/infra/clients/nestjs/read-gateways.module';
import { GetItemByIdUseCase } from '@app/inventory/read/hexagon/usecases/get-item-by-id/get-item-by-id.usecase';
import { GetItemByIdQuery } from '@app/inventory/read/hexagon/queries/get-item-by-id.query';
import { AuthGateway } from '@app/authentication';
import { AuthGatewaysModule } from '@app/authentication/infra/clients/nestjs/auth-gateways.module';
import { GetItemsInFolderUseCase } from '@app/inventory/read/hexagon/usecases/get-items-in-folder/get-items-in-folder.usecase';
import { GetItemsInFolderQuery } from '@app/inventory/read/hexagon/queries/get-items-in-folder.query';
import { GetFoldersInFoldersUseCase } from '@app/inventory/read/hexagon/usecases/get-folders-in-folders/get-folders-in-folders.usecase';
import { GetFoldersInFolderQuery } from '@app/inventory/read/hexagon/queries/get-folders-in-folder.query';

@Module({
  imports: [ReadGatewaysModule, AuthGatewaysModule],
  providers: [
    {
      provide: GetItemByIdUseCase,
      inject: ['GetItemByIdQuery', 'AuthGateway'],
      useFactory: (
        getItemByIdQuery: GetItemByIdQuery,
        authGateway: AuthGateway,
      ) => new GetItemByIdUseCase(getItemByIdQuery, authGateway),
    },
    {
      provide: GetItemsInFolderUseCase,
      inject: ['GetItemsInFolderQuery', 'AuthGateway'],
      useFactory: (
        getItemsInFolderQuery: GetItemsInFolderQuery,
        authGateway: AuthGateway,
      ) => new GetItemsInFolderUseCase(authGateway, getItemsInFolderQuery),
    },
    {
      provide: GetFoldersInFoldersUseCase,
      inject: ['GetFoldersInFolderQuery', 'AuthGateway'],
      useFactory: (
        getFoldersInFolderQuery: GetFoldersInFolderQuery,
        authGateway: AuthGateway,
      ) => new GetFoldersInFoldersUseCase(authGateway, getFoldersInFolderQuery),
    },
  ],
  exports: [
    GetItemByIdUseCase,
    GetItemsInFolderUseCase,
    GetFoldersInFoldersUseCase,
  ],
})
export class ReadUseCasesModule {}
