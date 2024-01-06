import { DomainEvent } from '@app/shared/event-bus/domain-event';

export interface EventBus {
  emit(event: DomainEvent): void;
}
