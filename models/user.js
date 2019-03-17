const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  name: String,
  email: String,
  created: Date,
  reservations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation'
    }
  ],
})

userSchema.statics.format = (user) => {
  return {
    id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    reservations: user.reservations,
    created: user.created
  }
}

const User = mongoose.model('User', userSchema)

userSchema.plugin(uniqueValidator)

module.exports = User
