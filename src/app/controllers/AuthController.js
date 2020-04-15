import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'
import User from '../models/User'

class AuthController {
  async store (ctx) {
    const { email, password } = ctx.body
    const user = await User.findOne({ where: { email } })
    if (!user) {
      ctx.status = 401
      ctx.response.body = { error: 'User not found' }
      return
    }
    if (!(await user.checkPassword(password))) {
      ctx.status = 401
      ctx.response.body = { error: 'Password does not match' }
      return
    }

    const { id } = user

    return ctx.response.body({
      user: {
        id,
        email
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    })
  }
}

export default new AuthController()
