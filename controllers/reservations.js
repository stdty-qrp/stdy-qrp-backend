const reservationsRouter = require('express').Router()
const Reservation = require('../models/reservation')
const moment = require('moment')

reservationsRouter.get('/', async (req, res) => {
  const localTimeString = moment().locale('fi-FI')
  const currentTime = moment(localTimeString, 'YYYY-MM-DD HH:mm:sss')
  const reservations = await Reservation.find({ endTime: { $gte: currentTime } })
    .populate('user', { id: 1, username: 1 })
  res.json(reservations.map(r => r.toJSON()))
})

reservationsRouter.get('/all', async (req, res) => {
  const reservations = await Reservation.find({})
    .populate('user', { id: 1, username: 1 })
  res.json(reservations.map(r => r.toJSON()))
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
