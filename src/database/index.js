import Sequelize from 'sequelize'

import Item from '../app/models/Item'

import databaseConfig from '../config/database'

const models = [Item]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(databaseConfig)

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
  }
}

export default new Database()
