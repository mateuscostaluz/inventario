import Sequelize, { Model } from 'sequelize'

class Department extends Model {
  static init (sequelize) {
    super.init({
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize
    })

    return this
  }
}

export default Department
