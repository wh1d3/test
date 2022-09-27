export const state = () => ({
  user: {},
  messages: [],
  users: []
})

export const mutations = {
  SOCKET_newMessage(state, message) {
    state.messages.push(message)
  },
  
  SOCKET_updateUsers(state, users) {
    state.users = users
  },

  setUser(state, user) {
    state.user = user
  },

  clearData(state) {
    state.user = {}
    state.messages = []
    state.users = []
  }
}
