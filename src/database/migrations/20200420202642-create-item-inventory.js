'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('item_inventory',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        inventory_id: {
          type: Sequelize.INTEGER,
          references: { model: 'inventories', key: 'id' },
          allowNull: false
        },
        item_id: {
          type: Sequelize.INTEGER,
          references: { model: 'items', key: 'id' },
          allowNull: false
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id' },
          allowNull: false
        },
        item_found_on_system: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        surplus: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        }
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('item_inventory')
  }
}
