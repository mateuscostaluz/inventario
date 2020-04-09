const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')
const User = require('../models/User')

class AuthController {
  async store (req, res) {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' })
    }

    const { id } = user

    return res.json({
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

module.exports = new AuthController()
