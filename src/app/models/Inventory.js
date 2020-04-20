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
}
export default Inventory
