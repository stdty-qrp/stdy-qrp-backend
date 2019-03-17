const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
    min: Date.now(),
  },
  active: Boolean
})

reservationSchema.statics.format = (reservation) => {
  return {
    id: reservation._id,
    startTime: reservation.startTime,
    endTime: reservation.endTime,
    name: reservation.name,
    active: reservation.active
  }
}

const Reservation = mongoose.model('Reservation', reservationSchema)

module.exports = Reservation
