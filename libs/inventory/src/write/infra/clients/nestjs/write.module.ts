import { Module } from '@nestjs/common';
import { WriteItemsController } from '@app/inventory/write/infra/clients/nestjs/controllers/write-items.controller';
import { WriteUseCasesModule } from '@app/inventory/write/infra/clients/nestjs/write-usecases.module';

@Module({
  imports: [WriteUseCasesModule],
  controllers: [WriteItemsController],
})
export class WriteModule {}
