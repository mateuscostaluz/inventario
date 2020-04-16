import Sequelize, { Model } from 'sequelize'

class Item extends Model {
  static init (sequelize) {
    super.init({
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {
      sequelize
    })

    return this
  }
}

export default Item
