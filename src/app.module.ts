import { Module } from '@nestjs/common';
import { InventoryModule } from '@app/inventory';
import { AuthModule } from '@app/authentication';
import { SharedModule } from '@app/shared';

@Module({
  imports: [SharedModule, AuthModule, InventoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
