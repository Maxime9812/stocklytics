import { Module } from '@nestjs/common';
import { WriteItemsController } from '@app/inventory/write/infra/clients/nestjs/controllers/write-items.controller';
import { CreateNewItemUseCase } from '@app/inventory/write/hexagon/usecases/create-new-item/create-new-item.usecase';
import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { DateProvider } from '@app/inventory/write/hexagon/models/date-provider/date.provider';
import { WriteGatewaysModule } from '@app/inventory/write/infra/clients/nestjs/write-gateways.module';
import { AuthGateway } from '@app/authentication/hexagon/gateways/auth.gateway';
import { AuthGatewaysModule } from '@app/authentication/infra/clients/nestjs/auth-gateways.module';

@Module({
  imports: [WriteGatewaysModule, AuthGatewaysModule],
  controllers: [WriteItemsController],
  providers: [
    {
      provide: CreateNewItemUseCase,
      inject: ['ItemsRepository', 'AuthGateway', 'DateProvider'],
      useFactory: (
        itemsRepository: ItemsRepository,
        authGateway: AuthGateway,
        dateProvider: DateProvider,
      ) => {
        return new CreateNewItemUseCase(
          itemsRepository,
          authGateway,
          dateProvider,
        );
      },
    },
  ],
  exports: [CreateNewItemUseCase],
})
export class WriteUseCasesModule {}
