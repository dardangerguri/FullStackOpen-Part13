const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, SECRET)
    if (!decodedToken.id)
      throw { name: 'JsonWebTokenError', message: 'invalid token' }
    const user = await User.findByPk(decodedToken.id)
    if (!user)
      throw { name: 'NotFound', message: 'user not found' }
    const blog = await Blog.create({ ...req.body, userId: user.id, author: user.name })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (!blog)
    throw { name: 'NotFound', message: 'Blog not found' }
  await blog.destroy()
  res.status(204).end()
})

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (!blog)
    throw { name: 'NotFound', message: 'Blog not found' }
  else if (typeof req.body.likes !== 'number')
    throw { name: 'TypeError', message: 'malformatted request' }
  blog.likes = req.body.likes
  await blog.save()
  res.json(blog)
})

module.exports = router
