import { Customer } from '../../entity/customer'
import { CustomerAddressChangedEvent } from './customer-address-changed.event'
import { CustomerCreatedEvent } from './customer-created.event'

describe('Customer Unit Tests', () => {
  test('constructor of customer created event', () => {
    const customer = new Customer('c1', 'customer1')
    const customerCreatedEvent = new CustomerCreatedEvent(customer)

    expect(customerCreatedEvent.eventData).toStrictEqual(customer)
    expect(customerCreatedEvent.dateTimeOccurred).toBeInstanceOf(Date)
  })

  test('constructor of customer changed address event', () => {
    const customer = new Customer('c1', 'customer1')
    const customerCreatedEvent = new CustomerAddressChangedEvent(customer)

    expect(customerCreatedEvent.eventData).toStrictEqual(customer)
    expect(customerCreatedEvent.dateTimeOccurred).toBeInstanceOf(Date)
  })
})
