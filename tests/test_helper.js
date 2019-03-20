const mongoose = require('mongoose')
const Reservation = require('../models/reservation')
const Room = require('../models/room')
const User = require('../models/user')

const roomId1 = mongoose.Types.ObjectId()
const roomId2 = mongoose.Types.ObjectId()
const roomId3 = mongoose.Types.ObjectId()
const roomId4 = mongoose.Types.ObjectId()
const reservationId1 = mongoose.Types.ObjectId()
const reservationId2 = mongoose.Types.ObjectId()
const reservationId3 = mongoose.Types.ObjectId()
const reservationId4 = mongoose.Types.ObjectId()
const userId1 = mongoose.Types.ObjectId()

const initialRooms = [
  {
    _id: roomId1,
    code: '123',
    name: 'Boiler Room',
    reservations: [reservationId1, reservationId2],
  },
  {
    _id: roomId2,
    code: '420',
    name: 'Hot Box',
    reservations: [reservationId3],
  },
  {
    _id: roomId3,
    code: '666',
    name: 'The Pit',
    reservations: [reservationId4],
  },
  {
    _id: roomId4,
    code: '007',
    name: 'Secret',
  },
]

const initialUsers = [
  {
    _id: userId1,
    username: 'TheBadMF',
    reservations: [reservationId1, reservationId2, reservationId3, reservationId4],
  },
]

const initialReservations = [
  // inactive
  {
    _id: reservationId1,
    name: 'Test1 inactive',
    startTime: '2019-03-13T16:00:00.000Z',
    endTime: '2019-03-13T15:00:00.000Z',
    user: userId1,
    room: roomId1,
  },
  {
    _id: reservationId2,
    name: 'Test2 inactive',
    startTime: '2019-03-13T18:00:00.000Z',
    endTime: '2019-03-13T19:00:00.000Z',
    user: userId1,
    room: roomId1,
  },
  // active
  {
    _id: reservationId3,
    name: 'Test2',
    startTime: new Date(),
    endTime: new Date(Date.now() + (1000 * 60 * 60)),
    user: userId1,
    room: roomId2,
  },
  {
    _id: reservationId4,
    name: 'Test3',
    startTime: new Date(),
    endTime: new Date(Date.now() + (1000 * 60 * 60)),
    user: userId1,
    room: roomId3,
  },
]

const roomsInDb = async () => {
  const rooms = await Room.find({})
  return rooms.map(r => r.toJSON())
}

const reservationsInDb = async () => {
  const reservations = await Reservation.find({})
  return reservations.map(r => r.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialRooms,
  initialReservations,
  initialUsers,
  roomsInDb,
  reservationsInDb,
  usersInDb,
}
