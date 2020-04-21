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
    this.belongsTo(models.Item, { foreignKey: 'id_item' })
    this.belongsTo(models.Department, { foreignKey: 'id_department' })
    this.belongsTo(models.Inventory, { foreignKey: 'id_inventory' })
    this.belongsTo(models.User, { foreignKey: 'id_user' })
  }
}

export default ItemInventory
