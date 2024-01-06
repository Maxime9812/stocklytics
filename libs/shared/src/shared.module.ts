import { Module } from '@nestjs/common';
import { EventBusModule } from '@app/shared/event-bus/event-bus.module';

@Module({
  imports: [EventBusModule],
})
export class SharedModule {}
