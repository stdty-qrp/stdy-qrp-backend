const reservationsRouter = require('express').Router()
const Reservation = require('../models/reservation')

reservationsRouter.get('/', async (request, response) => {
  const reservations = await Reservation.find({})
  response.json(reservations.map(Reservation.format))
})

reservationsRouter.post('/', async (req, res, next) => {
  const body = req.body

  const reservation = new Reservation({
    name: body.name,
    startTime: body.startTime,
    endTime: body.endTime,
    active: body.active || false,
  })

  try {
    const savedReservation = await reservation.save()
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
