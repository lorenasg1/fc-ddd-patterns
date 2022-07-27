import { v4 as uuid } from 'uuid'
import { Customer } from '../entity/customer'
import { Order } from '../entity/order'
import { OrderItem } from '../entity/order-item'

export class OrderService {
  static placeOrder(customer: Customer, items: OrderItem[]): Order {
    if (items.length === 0) {
      throw new Error('order must have at least one item')
    }

    const order = new Order(uuid(), customer.id, items)
    customer.addRewardPoints(order.getTotal() / 2)

    return order
  }

  static total(orders: Order[]): number {
    return orders.reduce((acc, order) => acc + order.getTotal(), 0)
  }
}