const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { Session, User } = require('../models')

const errorHandler = (error, req, res, next) => {
  console.error(error)

  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors.map(e => e.message)
    return res.status(400).json({ error: messages })
  }
  if (error.name === 'SequelizeDatabaseError')
    return res.status(400).json({ error: 'Database error' })
  if (error.name === 'NotFound')
    return res.status(404).json({ error: error.message })
  if (error.name === 'TypeError')
    return res.status(400).json({ error: 'Malformatted request' })
  if (error.name === 'PasswordError')
    return res.status(400).json({ error: error.message })
  if (error.name === 'JsonWebTokenError')
    return res.status(401).json({ error: 'invalid token' })
  if (error.name === 'TokenExpiredError')
    return res.status(401).json({ error: 'token expired' })
  if (error.name === 'AuthorizationError')
    return res.status(403).json({ error: error.message })
  return res.status(500).json({ error: 'Something went wrong' })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }
  next()
}

const tokenValidator = async (req, res, next) => {
  try {
    if (!req.token)
      throw { name: 'JsonWebTokenError', message: 'missing token' }
    const session = await Session.findOne({ where: { token: req.token } })
    if (!session)
      throw { name: 'JsonWebTokenError', message: 'expired or invalid token' }
    const decodedToken = jwt.verify(req.token, SECRET)
    if (!decodedToken.id)
      throw { name: 'JsonWebTokenError', message: 'invalid token' }
    const user = await User.findByPk(decodedToken.id)
    if (!user)
      throw { name: 'NotFound', message: 'user not found' }
    if (user.disabled)
      throw { name: 'AuthorizationError', message: 'user disabled' }
    req.userId = decodedToken.id
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  errorHandler, tokenExtractor, tokenValidator
}
