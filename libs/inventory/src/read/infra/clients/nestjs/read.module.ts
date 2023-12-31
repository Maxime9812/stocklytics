import { Module } from '@nestjs/common';
import { ReadUseCasesModule } from '@app/inventory/read/infra/clients/nestjs/read-usecases.module';
import { ReadItemsController } from '@app/inventory/read/infra/clients/nestjs/controllers/read-items.controller';

@Module({
  imports: [ReadUseCasesModule],
  controllers: [ReadItemsController],
})
export class ReadModule {}
