import { Module } from '@nestjs/common';
import { ReadGatewaysModule } from '@app/inventory/read/infra/clients/nestjs/read-gateways.module';

@Module({
  imports: [ReadGatewaysModule],
  providers: [],
  exports: [],
})
export class ReadUseCasesModule {}
