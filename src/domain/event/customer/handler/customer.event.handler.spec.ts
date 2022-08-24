import { Address } from '../../../entity/address'
import { Customer } from '../../../entity/customer'
import { CustomerCreatedEvent } from '../customer-created.event'
import { SendEmailWhenCustomerAddressIsChangedHandler } from './send-email-when-customer-address-is-changed.handler'
import { SendEmailWhenCustomerIsCreatedHandler } from './send-email-when-customer-is-created.handler'
import { SendSMSWhenCustomerIsCreatedHandler } from './send-sms-when-customer-is-created.handler'

describe('customer event handler unit test', () => {
  let consoleLogSpy: any

  beforeEach(() => (consoleLogSpy = jest.spyOn(console, 'log')))

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Send email when customer is created handler', () => {
    const customer = new Customer('c1', 'customer1')
    const customerCreatedEvent = new CustomerCreatedEvent(customer)

    new SendEmailWhenCustomerIsCreatedHandler().handle(customerCreatedEvent)

    expect(consoleLogSpy).toBeCalledWith(
      'Esse é o primeiro console.log do evento: CustomerCreated'
    )
  })

  it('Send sms when customer is created handler', () => {
    const customer = new Customer('c1', 'customer1')
    const customerCreatedEvent = new CustomerCreatedEvent(customer)

    new SendSMSWhenCustomerIsCreatedHandler().handle(customerCreatedEvent)

    expect(consoleLogSpy).toBeCalledWith(
      'Esse é o segundo console.log do evento: CustomerCreated'
    )
  })

  it('Send email when customer address is changed', () => {
    const customer = new Customer('c1', 'customer1')
    const address = new Address('street1', 1, 'zipcode', 'city1')
    console.log(address)
    customer.changeAddress(address)
    const customerCreatedEvent = new CustomerCreatedEvent({
      id: customer.id,
      name: customer.name,
      address: {
        street: address.street,
        number: address.number,
        zipcode: address.zipcode,
        city: address.city
      }
    })

    new SendEmailWhenCustomerAddressIsChangedHandler().handle(
      customerCreatedEvent
    )

    expect(consoleLogSpy).toBeCalledWith(
      `Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${customer.address.street}, ${customer.address.number}, ${customer.address.zipcode}, ${customer.address.city}`
    )
  })
})
