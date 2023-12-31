import { Module } from '@nestjs/common';
import { WriteModule } from '@app/inventory/write';
import { ReadModule } from '@app/inventory/read';

@Module({
  imports: [WriteModule, ReadModule],
  providers: [],
})
export class InventoryModule {}
