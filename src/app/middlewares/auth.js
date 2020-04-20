import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import authConfig from '../../config/auth'

module.exports = async (ctx, next) => {
  const authHeader = ctx.request.header.authorization
  if (!authHeader) {
    ctx.status = 401
    ctx.response.body = { error: 'Token not provided' }
    return
  }

  const [, token] = authHeader.split(' ')
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)

    ctx.status = 201
    ctx.request.userId = decoded.id

    return next()
  } catch (error) {
    console.log(token)
    ctx.status = 401
    ctx.response.body = ({ error: 'Token invalid' })
  }
}
