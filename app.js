const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const reservationsRouter = require('./controllers/reservations')

// logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error conneting to MongoDB:', error.message)
  })

app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.use('/api/reservations', reservationsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
