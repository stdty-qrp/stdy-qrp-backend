const mongoose = require('mongoose')

const channelSchema = new mongoose.Schema({
  name: String,
  channelId: String,
  URL: String,
  description: String
})

channelSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Channel = mongoose.model('Channel', channelSchema)

module.exports = Channel
