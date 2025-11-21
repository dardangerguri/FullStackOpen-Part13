const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { ReadingList, User, Blog } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    const { userId, blogId } = req.body;

    const user = await User.findByPk(userId)
    const blog = await Blog.findByPk(blogId)
    if (!user || !blog)
      throw { name: 'NotFound', message: 'user or blog not found' }

    const reading = await ReadingList.create({
      user_id: userId,
      blog_id: blogId,
      read: false,
    })
    res.json(reading)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, SECRET)
    if (!decodedToken.id)
      throw { name: 'JsonWebTokenError', message: 'invalid token' }
    const readingEntry = await ReadingList.findByPk(req.params.id)
    if (!readingEntry)
      throw { name: 'NotFound', message: 'reading list entry not found' }
    if (readingEntry.user_id !== decodedToken.id)
      throw { name: 'AuthorizationError', message: 'not authorized to update this reading' }
    readingEntry.read = req.body.read
    await readingEntry.save()
    res.json(readingEntry)
  } catch (error) {
    next(error)
  }
})

module.exports = router
