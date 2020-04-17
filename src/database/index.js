import Sequelize from 'sequelize'

import User from '../app/models/User'
import Item from '../app/models/Item'
import Inventory from '../app/models/Inventory'

import databaseConfig from '../config/database'

const models = [User, Item, Inventory]

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
