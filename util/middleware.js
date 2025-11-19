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
  return res.status(500).json({ error: 'Something went wrong' })
}

module.exports = {
  errorHandler,
}
