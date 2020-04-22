import Sequelize, { Model } from 'sequelize'

class ItemInventory extends Model {
  static init (sequelize) {
    super.init({
      item_found_on_system: Sequelize.BOOLEAN,
      surplus: Sequelize.BOOLEAN
    },
    {
      sequelize,
      tableName: 'item_inventory'
    })

    return this
  }

  static associate (models) {
    this.belongsTo(models.Item, { foreignKey: 'item_id' })
    this.belongsTo(models.Inventory, { foreignKey: 'inventory_id' })
    this.belongsTo(models.User, { foreignKey: 'user_id' })
  }
}

export default ItemInventory
