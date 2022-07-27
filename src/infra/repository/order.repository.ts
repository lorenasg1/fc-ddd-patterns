import { Order } from '../../domain/entity/order'
import { OrderItem } from '../../domain/entity/order-item'
import { OrderRepositoryInterface } from '../../domain/repository/order.repository.interface'
import { OrderItemModel } from '../db/sequelize/model/order-item.model'
import { OrderModel } from '../db/sequelize/model/order.model'

export class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customerId: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          productId: item.productId,
          quantity: item.quantity,
          orderId: item.id
        }))
      },
      {
        include: [{ model: OrderItemModel }]
      }
    )
  }

  async update(entity: Order): Promise<void> {
    const sequelize = OrderModel.sequelize

    await sequelize.transaction(async (t) => {
      await OrderItemModel.destroy({
        where: { orderId: entity.id },
        transaction: t
      })

      const items = entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        productId: item.productId,
        quantity: item.quantity,
        orderId: entity.id
      }))
      await OrderItemModel.bulkCreate(items, { transaction: t })
      await OrderModel.update(
        {
          customerId: entity.customerId,
          total: entity.total()
        },
        {
          where: { id: entity.id },
          transaction: t
        }
      )
    })
  }

  async find(id: string): Promise<Order> {
    let orderModel
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id
        },
        include: [{ model: OrderItemModel }],
        rejectOnEmpty: true
      })
    } catch (error) {
      throw new Error('order not found')
    }

    const order = new Order(
      orderModel.id,
      orderModel.customerId,
      orderModel.items.map((itemModel) => {
        const orderItem = new OrderItem(
          itemModel.id,
          itemModel.name,
          itemModel.price,
          itemModel.productId,
          itemModel.quantity
        )

        return orderItem
      })
    )

    return order
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }]
    })

    const orders = orderModels.map((orderModel) => {
      const order = new Order(
        orderModel.id,
        orderModel.customerId,
        orderModel.items.map((itemModel) => {
          const orderItem = new OrderItem(
            itemModel.id,
            itemModel.name,
            itemModel.price,
            itemModel.productId,
            itemModel.quantity
          )

          return orderItem
        })
      )

      return order
    })

    return orders
  }
}
