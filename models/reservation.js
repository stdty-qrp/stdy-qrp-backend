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
    validate: [dateValidator, 'startTime must be less than endTime'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
})

// https://stackoverflow.com/a/29416193/7010222
function dateValidator(value) {
  // `this` is the mongoose document
  return this.startTime <= value
}

reservationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Reservation = mongoose.model('Reservation', reservationSchema)

module.exports = Reservation
