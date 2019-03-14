const reservationsRouter = require('express').Router()
const Reservation = require('../models/reservation')

reservationsRouter.get('/', async (request, response) => {
  const reservations = await Reservation.find({})
  return response.json(reservations.map(Reservation.format))
})

reservationsRouter.delete('/:id', async (req, res, next) => {
  try {
    await Reservation.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch(exception) {
    next(exception)
  }
})

module.exports = reservationsRouter
