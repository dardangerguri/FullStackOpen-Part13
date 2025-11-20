const router = require('express').Router()
const { Sequelize} = require('sequelize')
const { Blog } = require('../models')

router.get('/', async (req, res, next) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        'author',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'articles'],
        [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes']
      ],
      group: ['author'],
      order: [[Sequelize.fn('SUM', Sequelize.col('likes')), 'DESC']]
    })
    res.json(authors)
  } catch (error) {
    next(error)
  }
})

module.exports = router
