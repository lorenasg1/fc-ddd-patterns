import { Sequelize } from 'sequelize-typescript'
import { Product } from '../../domain/entity/product'
import { ProductModel } from '../db/sequelize/model/product.model'
import { ProductRepository } from './product.repository'

describe('Product repository test', () => {
  let sequileze: Sequelize

  beforeEach(async () => {
    sequileze = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequileze.addModels([ProductModel])
    await sequileze.sync()
  })

  afterEach(async () => {
    await sequileze.close()
  })

  it('should create a product', async () => {
    const productRepository = new ProductRepository()
    const product = new Product('p1', 'product1', 100)

    await productRepository.create(product)

    const productModel = await ProductModel.findOne({ where: { id: 'p1' } })

    expect(productModel.toJSON()).toStrictEqual({
      id: 'p1',
      name: 'product1',
      price: 100
    })
  })

  it('should update a product', async () => {
    const productRepository = new ProductRepository()
    const product = new Product('p1', 'product1', 100)

    await productRepository.create(product)

    const productModel = await ProductModel.findOne({ where: { id: 'p1' } })

    expect(productModel.toJSON()).toStrictEqual({
      id: 'p1',
      name: 'product1',
      price: 100
    })

    product.changeName('product2')
    product.changePrice(200)

    await productRepository.update(product)

    const productModel2 = await ProductModel.findOne({ where: { id: 'p1' } })

    expect(productModel2.toJSON()).toStrictEqual({
      id: 'p1',
      name: 'product2',
      price: 200
    })
  })

  it('should find a product', async () => {
    const productRepository = new ProductRepository()
    const product = new Product('p1', 'product1', 100)

    await productRepository.create(product)

    const productModel = await ProductModel.findOne({ where: { id: 'p1' } })

    const foundProduct = await productRepository.find('p1')

    expect(productModel.toJSON()).toStrictEqual({
      id: foundProduct.id,
      name: foundProduct.name,
      price: foundProduct.price
    })
  })

  it('should find all products', async () => {
    const productRepository = new ProductRepository()
    const product1 = new Product('p1', 'product1', 100)
    await productRepository.create(product1)

    const product2 = new Product('p2', 'product2', 200)
    await productRepository.create(product2)

    const foundProducts = await productRepository.findAll()
    const products = [product1, product2]

    expect(products).toEqual(foundProducts)
  })
})
