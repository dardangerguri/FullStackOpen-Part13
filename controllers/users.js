const router = require('express').Router()
const bcrypt = require('bcrypt')

const { User, Blog, ReadingList } = require('../models')

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog,
        attributes: ['id', 'title', 'url', 'likes']
      },
      attributes: { exclude: ['passwordHash'] }
    })
    res.json(users)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: [ 'id', 'name', 'username' ],
      include: {
        as: 'readings',
        model: Blog,
        attributes: ['id', 'title', 'url', 'likes', 'author', 'year'],
        through: { as: 'readinglists', attributes: ['id', 'read'] }
      },
    })
    if (!user)
      throw { name: 'NotFound', message: 'User not found' }
    const userJSON = user.toJSON()
    userJSON.readings = userJSON.readings.map(blog => ({
      ...blog,
      readinglists: [blog.readinglists]
    }))
    res.json(userJSON)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body;
    if (!password || password.length < 3) {
      throw { name: 'PasswordError', message: 'Password must be at least 3 characters long' };
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ username, name, passwordHash });
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } })
    if (!user)
      throw { name: 'NotFound', message: 'User not found' }
    user.username = req.body.username
    await user.save()
    res.json(user)
  } catch (error) {
    next(error)
  }
})

module.exports = router
