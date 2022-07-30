import { CustomerAddressChangedEvent } from '../customer/customer-address-changed.event'
import { SendEmailWhenCustomerAddressIsChangedHandler } from '../customer/handler/send-email-when-customer-address-is-changed.handler'
import { SendEmailWhenCustomerIsCreatedHandler } from '../customer/handler/send-email-when-customer-is-created.handler'
import { SendSMSWhenCustomerIsCreatedHandler } from '../customer/handler/send-sms-when-customer-is-created.handler'
import { SendEmailWhenProductIsCreatedHandler } from '../product/handler/send-email-when-product-is-created.handler'
import { ProductCreatedEvent } from '../product/product-created.event'
import { EventDispatcher } from './event-dispatcher'

describe('domain events tests', () => {
  it('it should register an event handler', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeDefined()
    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent.length).toBe(1)
    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(eventHandler)
  })

  it('it should register event handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler1 = new SendEmailWhenCustomerIsCreatedHandler()
    const eventHandler2 = new SendSMSWhenCustomerIsCreatedHandler()
    const eventHandler3 = new SendEmailWhenCustomerAddressIsChangedHandler()

    eventDispatcher.register('CustomerCreatedEvent', eventHandler1)
    eventDispatcher.register('CustomerCreatedEvent', eventHandler2)
    eventDispatcher.register('CustomerAddressChangedEvent', eventHandler3)

    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent).toBeDefined()
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent.length).toBe(2)
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[0]).toMatchObject(eventHandler1)
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[1]).toMatchObject(eventHandler2)

    expect(eventDispatcher.getEventHandlers.CustomerAddressChangedEvent).toBeDefined()
    expect(eventDispatcher.getEventHandlers.CustomerAddressChangedEvent.length).toBe(1)
    expect(eventDispatcher.getEventHandlers.CustomerAddressChangedEvent[0]).toMatchObject(eventHandler3)
  })

  it('should unregister an event handler', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    eventDispatcher.unregister('ProductCreatedEvent', eventHandler)

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeDefined()
    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent.length).toBe(0)
  })

  it('should unregister all events', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler1 = new SendEmailWhenProductIsCreatedHandler()
    const eventHandler2 = new SendEmailWhenCustomerIsCreatedHandler()
    const eventHandler3 = new SendSMSWhenCustomerIsCreatedHandler()
    const eventHandler4 = new SendEmailWhenCustomerAddressIsChangedHandler()

    eventDispatcher.register('ProductCreatedEvent', eventHandler1)
    eventDispatcher.register('CustomerCreatedEvent', eventHandler2)
    eventDispatcher.register('CustomerCreatedEvent', eventHandler3)
    eventDispatcher.register('CustomerAddressChangedEvent', eventHandler4)

    eventDispatcher.unregisterAll()

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeUndefined()
  })

  it('should notify all event handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()
    const spyEventHandler = jest.spyOn(eventHandler, 'handle')
    const eventHandler2 = new SendEmailWhenCustomerAddressIsChangedHandler()
    const spyEventHandler2 = jest.spyOn(eventHandler2, 'handle')

    eventDispatcher.register('ProductCreatedEvent', eventHandler)
    eventDispatcher.register('CustomerAddressChangedEvent', eventHandler2)

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(eventHandler)
    expect(eventDispatcher.getEventHandlers.CustomerAddressChangedEvent[0]).toMatchObject(eventHandler2)

    const productCreatedEvent = new ProductCreatedEvent({
      name: 'p1',
      description: 'product1',
      price: 10.0
    })

    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: 'c1',
      name: 'customer1',
      address: {
        street: 'street1',
        number: 1,
        zipcode: 'zipcode1',
        city: 'city1'
      }
    })

    eventDispatcher.notify(productCreatedEvent)
    expect(spyEventHandler).toHaveBeenCalled()
    eventDispatcher.notify(customerAddressChangedEvent)
    expect(spyEventHandler2).toHaveBeenCalled()
  })
})
