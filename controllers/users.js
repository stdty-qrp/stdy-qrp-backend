const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
    .populate('reservations', { id: 1, name: 1, startTime: 1, endTime: 1, active: 1 })
  res.json(users.map(u => u.toJSON()))
})

usersRouter.get('/:id', async (req, res) => {
  const user = await User.findOne({ _id: req.params.id })
  res.json(user.toJSON())
})

usersRouter.post('/', async (req, res, next) => {
  const body = req.body

  const user = new User({
    name: body.name,
    username: body.username,
    reservation: [],
    created: new Date().toISOString()
  })

  try {
    const savedUser = await user.save()
    res.json(savedUser.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter
