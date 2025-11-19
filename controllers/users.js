const router = require('express').Router()
const bcrypt = require('bcrypt')

const { User } = require('../models')

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll()
    res.json(users)
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
