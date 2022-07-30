import { EventHandlerInterface } from '../../_shared/event-handler.interface'
import { EventInterface } from '../../_shared/event.interface'

export class SendEmailWhenCustomerAddressIsChangedHandler implements EventHandlerInterface {
  handle(event: EventInterface): void {
    const { id, name, address } = event.eventData
    console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${address.street}, ${address.number}, ${address.zipcode}, ${address.city}`)
  }
}
