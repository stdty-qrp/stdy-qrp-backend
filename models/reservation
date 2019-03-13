const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
  name: String,
  startTime: Date,
  endTime: Date,
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