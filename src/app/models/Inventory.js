import Sequelize, { Model } from 'sequelize'

class Inventory extends Model {
  static init (sequelize) {
    super.init({
      name: Sequelize.STRING,
      description: Sequelize.TEXT,
      end_date: Sequelize.DATE
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
export default Inventory
