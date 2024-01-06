import { EventBus } from '@app/shared/event-bus/event-bus';
import { DomainEvent } from '@app/shared/event-bus/domain-event';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class NestEventBus implements EventBus {
  constructor(private readonly eventEmitter2: EventEmitter2) {}
  emit(event: DomainEvent) {
    this.eventEmitter2.emit(event.constructor.name, event);
  }
}
