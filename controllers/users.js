const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users.map(User.format))
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findOne({ _id: request.params.id })
  response.json(User.format(user))
})

usersRouter.post('/', async (req, res, next) => {
  const body = req.body

  const reservation = new User({
    name: body.name,
    username: body.username,
    reservation: [],
    created: new Date().toISOString()
  })

  try {
    const savedUser = await reservation.save()
    res.json(User.format(savedUser))
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter