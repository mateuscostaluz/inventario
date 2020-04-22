import Sequelize from 'sequelize'

import Department from '../app/models/Department'
import Inventory from '../app/models/Inventory'
import Item from '../app/models/Item'
import ItemInventory from '../app/models/ItemInventory'
import User from '../app/models/User'

import databaseConfig from '../config/database'

const models = [Department, Inventory, Item, ItemInventory, User]

class Database {
  constructor () {
    this.init()
  }

  init () {
    this.connection = new Sequelize(databaseConfig)

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
  }
}

export default new Database()
