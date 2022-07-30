import { EventHandlerInterface } from '../../_shared/event-handler.interface'
import { EventInterface } from '../../_shared/event.interface'

export class SendEmailWhenCustomerIsCreatedHandler implements EventHandlerInterface {
  handle(event: EventInterface): void {
    console.log('Esse é o primeiro console.log do evento: CustomerCreated')
  }
}
