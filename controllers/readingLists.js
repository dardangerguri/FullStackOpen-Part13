const router = require('express').Router()

const { ReadingList, Blog } = require('../models')
const { tokenValidator } = require('../util/middleware')

router.post('/', tokenValidator, async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.body.blogId)
    if (!blog)
      throw { name: 'NotFound', message: 'user or blog not found' }

    const reading = await ReadingList.create({
      user_id: req.userId,
      blog_id: req.body.blogId,
      read: false,
    })
    res.json(reading)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenValidator, async (req, res, next) => {
  try {
    const readingEntry = await ReadingList.findByPk(req.params.id)
    if (!readingEntry)
      throw { name: 'NotFound', message: 'reading list entry not found' }
    if (readingEntry.user_id !== req.userId)
      throw { name: 'AuthorizationError', message: 'not authorized to update this reading' }
    readingEntry.read = req.body.read
    await readingEntry.save()
    res.json(readingEntry)
  } catch (error) {
    next(error)
  }
})

module.exports = router
