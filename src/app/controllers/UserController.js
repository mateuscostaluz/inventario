import User from '../models/User'
import * as Yup from 'yup'

class UserController {
  async index (ctx) {
    const users = await User.findAll()
    ctx.status = 200
    ctx.response.body = users
  }

  async store (ctx) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6)
    })

    if (!await schema.isValid(ctx.request.body)) {
      ctx.status = 400
      ctx.response.body = { error: 'Validation fails' }
      return ctx.response.body
    }

    const { name, email, password } = ctx.request.body
    const usr = await User.findOne({ where: { email } })
    if (usr) {
      ctx.status = 409
      ctx.response.body = { error: `Email ${email} already exists` }
      return
    }

    const user = await User.create({ name, email, password })
    ctx.status = 201
    ctx.response.body = { id: user.id, name, email }
  }

  async update (ctx) {
    const { userId } = ctx.request
    const { name, email, active } = ctx.request.body

    const user = await User.findByPk(userId)
    const emailExists = await User.findOne({ where: { email } })

    if (user.id !== emailExists.id) {
      ctx.status = 409
      ctx.response.body = { error: `Email ${email} already exists` }
      return
    }

    user.name = name
    user.email = email
    user.active = active

    await user.save()
    ctx.status = 200
  }

  async delete (ctx) {
    const { userId } = ctx.request

    const user = await User.findByPk(userId)
    user.active = false

    await user.save()
    ctx.status = 204
  }
}

export default new UserController()
