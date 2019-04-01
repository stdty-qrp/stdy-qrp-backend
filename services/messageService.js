const TelegramBot = require('node-telegram-bot-api')

const telegramBotService = (function(){

  // Create a bot that uses 'polling' to fetch new updates
  let bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: true
  })

  bot.onText(/\/rooms/, (msg) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Wait a sec... My algorithm is slow...', { parse_mode: 'HTML' })
  })

  // Matches "/echo [whatever]"
  bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    const chatId = msg.chat.id
    console.log('Got a message! chatid', chatId)
    const resp = match[1] // the captured "whatever"
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp)
  })

  // Listen for any kind of message. There are different kinds of
  // messages.
  bot.on('message', (msg) => {
    const chatId = msg.chat.id
    console.log('Got a message! chatid', chatId)
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message!', { parse_mode: 'HTML' })
  })

  return {
    sendMessage: (message) => {
      bot.sendMessage(519736021, message, { parse_mode: 'HTML' })
    }
  }

})()

module.exports = telegramBotService
