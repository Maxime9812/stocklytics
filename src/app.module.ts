import { Module } from '@nestjs/common';
import { InventoryModule } from '@app/inventory';
import { AuthModule } from '@app/authentication';

@Module({
  imports: [AuthModule, InventoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
