const errorHandler = (error, req, res, next) => {
  console.error(error);

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

module.exports = {
  errorHandler, tokenExtractor
}
