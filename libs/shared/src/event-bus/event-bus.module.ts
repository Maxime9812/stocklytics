import { Module } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { NestEventBus } from '@app/shared/event-bus/nest-event-bus';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    {
      provide: 'EVENT_BUS',
      inject: [EventEmitter2],
      useFactory: (eventEmitter: EventEmitter2) => {
        return new NestEventBus(eventEmitter);
      },
    },
  ],
  exports: ['EVENT_BUS'],
})
export class EventBusModule {}
