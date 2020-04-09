const Sequelize = require('sequelize')
const { Model } = require('sequelize')
const bcrypt = require('bcrypt')

class User extends Model {
  static init (sequelize) {
    super.init({
      nome: Sequelize.STRING,
      email: Sequelize.STRING,
      senha: Sequelize.VIRTUAL,
      senha_hash: Sequelize.STRING
    })

    this.addHook('beforeSave', async (user) => {
      if (user.senha) {
        user.senha_hash = await bcrypt.hash(user.senha, 8)
      }
    })
    return this
  }

  checkPassword (senha) {
    return bcrypt.compare(senha, this.senha_hash)
  }
}

module.exports = User
