const router = require('express').Router()
const { Session } = require('../models')
const { userExtractor, tokenExtractor, tokenValidator } = require('../util/middleware')

router.delete('/', tokenExtractor, tokenValidator, async (req, res) => {
  await Session.destroy({ where: { token: req.token } })
  res.status(204).end()
})

module.exports = router