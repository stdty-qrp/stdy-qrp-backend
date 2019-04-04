const channelsRouter = require('express').Router()
const Channel = require('../models/channel')

channelsRouter.get('/', async (req, res) => {
  const channels = await Channel.find({})
  res.json(channels.map(c => c.toJSON()))
})


module.exports = channelsRouter