import { Address } from './domain/entity/address'
import { Customer } from './domain/entity/customer'
import { Order } from './domain/entity/order'
import { OrderItem } from './domain/entity/order-item'
import { Product } from './domain/entity/product'

const customer = new Customer('c1', 'Lorena')
const address = new Address('street1', 50, 'zipcode1', 'cncity1')
Object.assign(customer, {
  address
})
customer.activate()

const product1 = new Product('p1', 'product1', 10)
const product2 = new Product('p2', 'product2', 20)

const item1 = new OrderItem('oi1', 'item1', 10, product1.id, 2)
const item2 = new OrderItem('oi2', 'item2', 15, product2.id, 1)
const order = new Order('o1', 'c1', [item1, item2])

console.log({ order })
