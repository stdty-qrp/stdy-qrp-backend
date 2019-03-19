const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const reservationsRouter = require('./controllers/reservations')
const roomsRouter = require('./controllers/rooms')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const initTelegramBot = require('./services/messageService')
const cors = require('cors')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error conneting to MongoDB:', error.message)
  })

if (process.env.TELEGRAM_BOT_TOKEN !== undefined && process.env.NODE_ENV !== 'test') {
  const telegramService = initTelegramBot(process.env.TELEGRAM_BOT_TOKEN)
  telegramService.sendMessage('Hi, I\'m your host today!')
}

app.use(cors())
// app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.use('/api/reservations', reservationsRouter)
app.use('/api/rooms', roomsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
