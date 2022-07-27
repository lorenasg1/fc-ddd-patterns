import { Address } from './address'

export class Customer {
  private _id: string
  private _name: string
  private _address!: Address
  private _active: boolean = false
  private _rewardPoints: number = 0

  constructor(id: string, name: string) {
    this._id = id
    this._name = name
    this.validate()
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error('id is required')
    }

    if (this._name.length === 0) {
      throw new Error('name is required')
    }
  }

  changeName(name: string) {
    this._name = name
    this.validate()
  }

  changeAddress(address: Address) {
    this._address = address
    this.validate()
  }

  get id(): string {
    return this._id
  }

  get rewardPoints(): number {
    return this._rewardPoints
  }

  get name(): string {
    return this._name
  }

  get address(): Address {
    return this._address
  }

  isActive(): boolean {
    return this._active
  }

  activate() {
    if (this._address === undefined) {
      throw new Error('address is mandatory to activate a customer')
    }
    this._active = true
  }

  deactivate() {
    this._active = false
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points
  }
}
