import { Sequelize } from 'sequelize-typescript'
import { Address } from '../../domain/entity/address'
import { Customer } from '../../domain/entity/customer'
import { Order } from '../../domain/entity/order'
import { OrderItem } from '../../domain/entity/order-item'
import { Product } from '../../domain/entity/product'
import { CustomerModel } from '../db/sequelize/model/customer.model'
import { OrderItemModel } from '../db/sequelize/model/order-item.model'
import { OrderModel } from '../db/sequelize/model/order.model'
import { ProductModel } from '../db/sequelize/model/product.model'
import { CustomerRepository } from './customer.repository'
import { OrderRepository } from './order.repository'
import { ProductRepository } from './product.repository'

describe('Order repository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    await sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a new order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('c1', 'customer1')
    const address = new Address('street1', 1, 'zipcode1', 'city1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('p1', 'product1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      'oi1',
      product.name,
      product.price,
      product.id,
      2
    )

    const order = new Order('o1', customer.id, [orderItem])

    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items']
    })

    expect(orderModel.toJSON()).toStrictEqual({
      id: 'o1',
      customerId: 'c1',
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          orderId: 'o1',
          productId: 'p1'
        }
      ]
    })
  })

  it('should update an order change the item', async () => {
    const customerRepository = new CustomerRepository()
    const customer1 = new Customer('c1', 'customer1')
    const address1 = new Address('street1', 1, 'zipcode1', 'city1')
    customer1.changeAddress(address1)
    await customerRepository.create(customer1)

    const productRepository = new ProductRepository()
    const product1 = new Product('p1', 'product1', 10)
    await productRepository.create(product1)

    const orderItem = new OrderItem(
      'oi1',
      product1.name,
      product1.price,
      product1.id,
      2
    )

    const order = new Order('o1', customer1.id, [orderItem])

    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items']
    })

    expect(orderModel.toJSON()).toStrictEqual({
      id: 'o1',
      customerId: 'c1',
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          orderId: 'o1',
          productId: 'p1'
        }
      ]
    })

    const customer2 = new Customer('c2', 'customer2')
    const address2 = new Address('street2', 2, 'zipcode2', 'city2')
    customer2.changeAddress(address2)
    await customerRepository.create(customer2)

    const product2 = new Product('p2', 'product2', 50)
    await productRepository.create(product2)

    const orderItemChanged = new OrderItem(
      'oi1',
      product2.name,
      product2.price,
      product2.id,
      3
    )

    order.changeCustomerId(customer2.id)
    order.changeItems([orderItemChanged])
    await orderRepository.update(order)

    const orderModelChanged = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items']
    })

    expect(orderModelChanged.items).toHaveLength(1)
    expect(orderModelChanged.toJSON()).toStrictEqual({
      id: order.id,
      customerId: order.customerId,
      total: order.total(),
      items: [
        {
          id: orderItemChanged.id,
          name: orderItemChanged.name,
          price: orderItemChanged.price,
          quantity: orderItemChanged.quantity,
          orderId: order.id,
          productId: orderItemChanged.productId
        }
      ]
    })
  })

  it('should find an order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('c1', 'customer1')
    const address = new Address('street1', 1, 'zipcode1', 'city1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('p1', 'product1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      'oi1',
      product.name,
      product.price,
      product.id,
      2
    )

    const order = new Order('o1', customer.id, [orderItem])

    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const foundOrder = await orderRepository.find(order.id)

    expect(order).toStrictEqual(foundOrder)
  })

  it('should throw an error when order is not found', async () => {
    const orderRepository = new OrderRepository()

    expect(async () => {
      await orderRepository.find('1')
    }).rejects.toThrow('order not found')
  })

  it('should find all orders', async () => {
    const customerRepository = new CustomerRepository()
    const customer1 = new Customer('c1', 'customer1')
    const address1 = new Address('street1', 1, 'zipcode1', 'city1')
    customer1.changeAddress(address1)
    await customerRepository.create(customer1)

    const productRepository = new ProductRepository()
    const product1 = new Product('c1', 'product1', 10)
    await productRepository.create(product1)

    const orderItem1 = new OrderItem(
      'oi1',
      product1.name,
      product1.price,
      product1.id,
      2
    )

    const order1 = new Order('o1', customer1.id, [orderItem1])

    const orderRepository = new OrderRepository()
    await orderRepository.create(order1)

    const customer2 = new Customer('c2', 'customer2')
    const address2 = new Address('street2', 2, 'zipcode2', 'city2')
    customer2.changeAddress(address2)
    await customerRepository.create(customer2)

    const product2 = new Product('p2', 'product2', 20)
    await productRepository.create(product2)

    const orderItem2 = new OrderItem(
      'oi2',
      product2.name,
      product2.price,
      product2.id,
      3
    )

    const order2 = new Order('o2', customer2.id, [orderItem2])

    await orderRepository.create(order2)

    const foundOrders = await orderRepository.findAll()
    const orders = [order1, order2]

    expect(foundOrders).toHaveLength(2)
    expect(foundOrders).toContainEqual(order1)
    expect(foundOrders).toContainEqual(order2)
    expect(foundOrders).toStrictEqual(orders)
  })
})
