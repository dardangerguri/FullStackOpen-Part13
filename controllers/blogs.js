const router = require('express').Router()
const { Op } = require('sequelize');
const { tokenValidator } = require('../util/middleware')

const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
  const where = {}
  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
    ]
  }
  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ['id', 'name', 'username']
    },
    attributes: { exclude: ['userId'] },
    where,
    order: [['likes', 'DESC']]
  })
  res.json(blogs)
})

router.post('/', tokenValidator, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId)
    const blog = await Blog.create({ ...req.body, userId: user.id, author: user.name })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', tokenValidator, async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog)
      throw { name: 'NotFound', message: 'Blog not found' }
    if (blog.userId !== req.userId)
      throw { name: 'AuthorizationError', message: 'not authorized to delete this blog' }
    await blog.destroy()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog)
      throw { name: 'NotFound', message: 'Blog not found' }
    else if (typeof req.body.likes !== 'number')
      throw { name: 'TypeError', message: 'malformatted request' }
    blog.likes = req.body.likes
    await blog.save()
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

module.exports = router
