const mongoose = require('mongoose')
const Reservation = require('../models/reservation')
const User = require('../models/user')

const reservationId1 = mongoose.Types.ObjectId()
const reservationId2 = mongoose.Types.ObjectId()
const userId1 = mongoose.Types.ObjectId()

const initialUsers = [
  {
    _id: userId1,
    username: 'TheBadMF',
    reservations: [reservationId1, reservationId2],
  },
]

const initialReservations = [
  {
    _id: reservationId1,
    name: 'Test1',
    startTime: new Date(),
    endTime: new Date(Date.now() + (1000 * 60 * 60)), // 2019-03-13T15:00:00.000Z
    active: true,
    user: userId1,
  },
  {
    _id: reservationId2,
    name: 'Test2',
    startTime: new Date(),
    endTime: new Date(Date.now() + (1000 * 60 * 60)),
    active: true,
    user: userId1,
  },
]

const reservationsInDb = async () => {
  const reservations = await Reservation.find({})
  return reservations.map(r => r.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialReservations,
  initialUsers,
  reservationsInDb,
  usersInDb,
}
