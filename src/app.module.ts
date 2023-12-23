import { Module } from '@nestjs/common';
import { InventoryModule } from '@app/inventory';

@Module({
  imports: [InventoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
