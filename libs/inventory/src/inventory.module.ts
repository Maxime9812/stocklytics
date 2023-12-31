import { Module, Scope } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGateway } from '@app/authentication/hexagon/gateways/auth.gateway';
import { AuthGuard } from '@app/inventory/write/infra/clients/nestjs/guards/auth.guard';
import { WriteModule } from '@app/inventory/write';
import { ReadModule } from '@app/inventory/read';
import { WriteGatewaysModule } from '@app/inventory/write/infra/clients/nestjs/write-gateways.module';

@Module({
  imports: [WriteModule, ReadModule, WriteGatewaysModule], // TODO move WriteGatewaysModule to auth context
  providers: [],
})
export class InventoryModule {}
