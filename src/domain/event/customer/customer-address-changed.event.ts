import { EventInterface } from '../_shared/event.interface'

export class CustomerAddressChangedEvent implements EventInterface {
  dateTimeOccurred: Date
  eventData: any

  constructor(eventData: any) {
    this.dateTimeOccurred = new Date()
    this.eventData = eventData
  }
}
