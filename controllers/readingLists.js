const router = require('express').Router()

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

module.exports = router
