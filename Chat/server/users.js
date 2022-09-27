class Users {
  constructor() {
    this.users = []
  }

  add(user) {
    this.users.push(user)
  }

  get(id) {
    return this.users.find(user => user.id === id)
  }

  remove(id) {
    const user = this.get(id)

    if (user) {
      this.users = this.users.filter(user => user.id !== id)
    }

    return user
  }

  getByChatId(chatId) {
    return this.users.filter(user => user.chatId === chatId)
  }
}

module.exports = function() {
  return new Users()
}
