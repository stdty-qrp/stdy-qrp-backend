const roomsRouter = require('express').Router()
const Room = require('../models/room')

roomsRouter.get('/', async (req, res) => {
  const rooms = await Room.find({})
    .populate('reservations', { id: 1, name: 1, startTime: 1, endTime: 1, active: 1 })
  res.json(rooms.map(u => u.toJSON()))
})

// roomsRouter.get('/:id', async (req, res) => {
//   const room = await Room.findOne({ _id: req.params.id })
//   res.json(room.toJSON())
// })

module.exports = roomsRouter
