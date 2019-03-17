const Reservation = require('../models/reservation')

const initialReservations = [
  {
    name: 'Test1',
    startTime: new Date(),
    endTime: new Date(Date.now() + (1000 * 60 * 60)), // 2019-03-13T15:00:00.000Z
    active: true,
  },
  {
    name: 'Test2',
    startTime: new Date(),
    endTime: new Date(Date.now() + (1000 * 60 * 60)),
    active: true,
  },
]

const reservationsInDb = async () => {
  const reservations = await Reservation.find({})
  return reservations.map(Reservation.format)
}

module.exports = {
  initialReservations,
  reservationsInDb,
}
