import { EventHandlerInterface } from '../../_shared/event-handler.interface'
import { EventInterface } from '../../_shared/event.interface'

export class SendEmailWhenProductIsCreatedHandler implements EventHandlerInterface {
  handle(event: EventInterface): void {
    console.log('Sending email to...')
  }
}
