import { Address } from './domain/entity/address'
import { Customer } from './domain/entity/customer'
import { Order } from './domain/entity/order'
import { OrderItem } from './domain/entity/order-item'
import { Product } from './domain/entity/product'

const customer = new Customer('123', 'Lorena')
const address = new Address('rua sdm', 50, '1234567', 'cn')
Object.assign(customer, {
  address
})
customer.activate()

const product1 = new Product('p1', 'product1', 10)
const product2 = new Product('p2', 'product2', 20)

const item1 = new OrderItem('i1', 'item1', product1.id, 10, 2)
const item2 = new OrderItem('i2', 'item2', product2.id, 15, 1)
const order = new Order('1', '123', [item1, item2])

console.log({ order })
