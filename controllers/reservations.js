const reservationsRouter = require('express').Router()
const Reservation = require('../models/reservation')
const User = require('../models/user')
const telegramBotService = require('../services/messageService')

reservationsRouter.get('/', async (req, res) => {
  const reservations = await Reservation.find({})
    .populate('user', { id: 1, username: 1 })
  res.json(reservations.map(r => r.toJSON()))
})

reservationsRouter.post('/', async (req, res, next) => {
  const body = req.body

  try {
    if (!body.username) {
      return res.status(401).json({ error: 'username missing' })
    }

    let user = await User.findOne({ username: body.username })

    if (!user) {
      const newUser = new User({
        username: body.username,
        created: new Date().toISOString(),
      })
      user = await newUser.save()
    }

    const reservation = new Reservation({
      name: body.name,
      startTime: body.startTime || new Date().toISOString(),
      endTime: body.endTime || new Date(Date.now() + (1000 * 60 * 60)).toISOString(),
      active: body.active || true,
      user: user._id,
    })

    const savedReservation = await reservation.save()
    user.reservations = user.reservations.concat(savedReservation._id)
    await user.save()
    // let's send a message to Telegram
    telegramBotService.sendMessage(`A new reservation created by ${user.username}. The topic is ${reservation.name}`)

    await Reservation.populate(savedReservation, { path: 'user', select: { 'username': 1, 'id': 1 } })
    res.json(savedReservation.toJSON())
  } catch(exception) {
    next(exception)
  }
})

reservationsRouter.delete('/:id', async (req, res, next) => {
  try {
    await Reservation.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch(exception) {
    next(exception)
  }
})

reservationsRouter.put('/:id', (req, res) => {
  const body = req.body
  const reservation = {
    name: body.name,
    startTime: body.startTime,
    endTime: body.endTime,
    active: body.active,
  }

  Reservation.findOneAndUpdate({ _id: req.params.id }, reservation, { new: true })
    .then(updatedReservation => {
      res.json(updatedReservation.toJSON())
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({
        error: 'Something went wrong :('
      })
    })
})

module.exports = reservationsRouter
