const roomsRouter = require('express').Router()
const telegramBotService = require('../services/messageService')
const Reservation = require('../models/reservation')
const Room = require('../models/room')
const User = require('../models/user')

roomsRouter.get('/', async (req, res) => {
  const rooms = await Room.find({})
  res.json(rooms.map(u => u.toJSON()))
})

roomsRouter.post('/:id/reservation', async (req, res, next) => {
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
      user: user._id,
    })

    const savedReservation = await reservation.save()
    user.reservations = user.reservations.concat(savedReservation._id)
    await user.save()
    // let's send a message to Telegram
    telegramBotService.sendMessage(`A new reservation created by ${user.username}. The subject of the is ${reservation.name}`)

    await Reservation.populate(savedReservation, { path: 'user', select: { 'username': 1, 'id': 1 } })
    res.json(savedReservation.toJSON())
  } catch(exception) {
    next(exception)
  }
})

// roomsRouter.get('/:id', async (req, res) => {
//   const room = await Room.findOne({ _id: req.params.id })
//   res.json(room.toJSON())
// })

module.exports = roomsRouter
