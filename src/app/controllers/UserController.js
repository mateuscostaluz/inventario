import User from '../models/User'

class UserController {

  async index (ctx) {
    const users = await User.findAll()
    ctx.status = 200
    ctx.response.body = users
  }

  async store (ctx) {
    const { name, email, password } = ctx.request.body
    try {
      const usr = await User.findOne({ where: { email } })
      if (usr) {
        ctx.status = 409
        ctx.response.body = { error: `Email ${email} already exists` }
        return
      }

      const user = await User.create({ name, email, password })
      ctx.status = 201
      ctx.response.body = { id: user.id, name, email }
      return
    } catch (e) {
      ctx.status = 400
      ctx.response.body = { error: 'An error ocorred' }
    }
  }

  async update (ctx) {
    const { userId } = ctx.request
    const { name, email } = ctx.request.body

    const user = await User.findByPk(userId)
    const emailExists = await User.findOne({ where: { email } })

    if (user.id !== emailExists.id) {
      ctx.status = 409
      ctx.response.body = { error: `Email ${email} already exists` }
      return
    }

    user.name = name
    user.email = email

    try {
      await user.save()
      ctx.status = 200
    } catch (error) {
      ctx.status = 400
      ctx.response.body = { error: 'Unexpected error' }
    }
  }
}

export default new UserController()
