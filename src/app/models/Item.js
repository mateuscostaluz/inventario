import Sequelize, { Model } from 'sequelize'

class Item extends Model {
  static init (sequelize) {
    super.init({
      name: Sequelize.STRING
    },
    {
      sequelize
    })

    return this
  }

  static associate (models) {
    this.belongsTo(models.Department, { foreignKey: 'department_id' })
  }
}

export default Item
