const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  reservations: Array,
  created: Date
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

module.exports = User