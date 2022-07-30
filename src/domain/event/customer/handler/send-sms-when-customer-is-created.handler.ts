import { EventHandlerInterface } from '../../_shared/event-handler.interface'
import { EventInterface } from '../../_shared/event.interface'

export class SendSMSWhenCustomerIsCreatedHandler implements EventHandlerInterface {
  handle(event: EventInterface): void {
    console.log('Esse é o segundo console.log do evento: CustomerCreated')
  }
}
