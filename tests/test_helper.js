const Reservation = require('../models/reservation')

const initialReservations = [
  {
    name: 'Test1',
    startTime: '2019-03-13T15:00:00.000Z',
    endTime: '2019-03-13T16:00:00.000Z',
    active: true,
  },
  {
    name: 'Test2',
    startTime: '2019-03-13T15:00:00.000Z',
    endTime: '2019-03-13T16:00:00.000Z',
    active: true,
  },
]

const reservationsInDb = async () => {
  const reservations = await Reservation.find({})
  return reservations.map(reservation => reservation.toJSON())
}

module.exports = {
  initialReservations,
  reservationsInDb,
}
