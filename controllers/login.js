const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const { User, Session } = require('../models')
const { SECRET } = require('../util/config')

loginRouter.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ where: { username } })
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      throw { name: 'AuthorizationError', message: 'invalid username or password' }
    }

    const userForToken = {
      username: user.username,
      id: user.id
    }

    const token = jwt.sign(userForToken, SECRET)

    await Session.create({
      user_id: user.id,
      token: token
    })

    res.status(200).json({ token, username: user.username, name: user.name })
  } catch (error) {
    next(error)
  }
})

module.exports = loginRouter
