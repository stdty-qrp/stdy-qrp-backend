const Reservation = require('../models/reservation')
const User = require('../models/user')

const initialUsers = [
  {
    username: 'TheBadMF',
  },
]

const initialReservations = [
  {
    name: 'Test1',
    startTime: new Date(),
    endTime: new Date(Date.now() + (1000 * 60 * 60)), // 2019-03-13T15:00:00.000Z
    active: true,
    user: '5c8e5babe03f3e6bb5bc1385', // TODO: from initialUsers
  },
  {
    name: 'Test2',
    startTime: new Date(),
    endTime: new Date(Date.now() + (1000 * 60 * 60)),
    active: true,
    user: '5c8e5babe03f3e6bb5bc1385', // TODO: from initialUsers
  },
]

const reservationsInDb = async () => {
  const reservations = await Reservation.find({})
  return reservations.map(Reservation.format)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(User.format)
}

module.exports = {
  initialReservations,
  initialUsers,
  reservationsInDb,
  usersInDb,
}
