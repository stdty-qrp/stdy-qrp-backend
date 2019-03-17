const reservationsRouter = require('express').Router()
const Reservation = require('../models/reservation')
const User = require('../models/user')

reservationsRouter.get('/', async (request, response) => {
  const reservations = await Reservation.find({})
    .find({}).populate('user', { username: 1, id: 1 })
  response.json(reservations.map(Reservation.format))
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
      startTime: body.startTime,
      endTime: body.endTime,
      active: body.active || false,
      user: user._id,
    })

    const savedReservation = await reservation.save()
    user.reservations = user.reservations.concat(savedReservation._id)
    await user.save()

    await Reservation.populate(savedReservation, { path: 'user', select: { 'username': 1, 'id': 1 } })
    res.json(Reservation.format(savedReservation))
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
      res.json(Reservation.format(updatedReservation))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({
        error: 'Something went wrong :('
      })
    })
})

module.exports = reservationsRouter
