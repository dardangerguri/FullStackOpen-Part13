const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body)
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
