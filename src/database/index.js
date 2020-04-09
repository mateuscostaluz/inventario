const Sequelize = require('sequelize')

const Item = require('../app/models/Item')

const databaseConfig = require('../config/database')

const models = [Item]

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

module.exports = new Database()
