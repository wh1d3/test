const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const users = require('./users')()

const m = (name, text, id) => ({ name, text, id })

io.on('connection', socket => {
  socket.on('userJoined', (data, cb) => {
    if (!data.name || !data.chatId) {
      return cb('No data')
    }

    socket.join(data.chatId)

    users.remove(socket.id)
    users.add({
      id: socket.id,
      name: data.name,
      chatId: data.chatId
    })

    cb({ userId: socket.id })
    io.to(data.chatId).emit('updateUsers', users.getByChatId(data.chatId))
    socket.emit('newMessage', m('admin', `Вітаємо ${data.name}! Ви успішно підключились до чату.`))
    socket.broadcast.to(data.chatId).emit('newMessage', m('admin', `Користувач ${data.name} успішно зайшов в чат.`))
  })

  socket.on('createMessage', (data, cb) => {
    if (!data.text) {
      return cb('No message')
    }

    const user = users.get(data.id)
    if (user) {io.to(user.chatId).emit('newMessage', m(user.name, data.text, data.id))
    }
    cb()
  })

  socket.on('userLeft', (id, cb) => {
    const user = users.remove(id)
    if (user) {
      io.to(user.chatId).emit('updateUsers', users.getByChatId(user.chatId))
      io.to(user.chatId).emit('newMessage', m('admin', `Користувач ${user.name} вийшов з чату.`))
    }
    cb()
  })

  socket.on('disconnect', () => {
    const user = users.remove(socket.id)
    if (user) {
      io.to(user.chatId).emit('updateUsers', users.getByChatId(user.chatId))
      io.to(user.chatId).emit('newMessage', m('admin', `Користувач ${user.name} вийшов з чату.`))
    }
  })
})

module.exports = {
  app,
  server
}
