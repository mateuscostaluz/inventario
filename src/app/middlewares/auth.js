import jwt from 'jsonwebtoken'
import { promisify } from 'utils'
import authConfig from '../../config/auth'

module.exports = async (ctx, next) => {
  const authHeader = ctx.header.authorization
  if (!authHeader) {
    ctx.status = 401
    ctx.response.body = { error: 'Token not provided' }
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)

    ctx.request.userId = decoded.id

    return next()
  } catch (error) {
    ctx.status = 401
    ctx.response.body = ({ error: 'Token invalid' })
  }
}
