<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8>
      <v-card min-width="400">
        <v-snackbar v-model="snackbar" :timeout="6000" top>
          {{ message }}
          <v-btn color="pink" flat @click="snackbar = false">Закрити</v-btn>
        </v-snackbar>

        <v-card-title>
          <h1>Encrypt-Chat</h1>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="name" :counter="16" :rules="nameRules" label="Ваш логін" required></v-text-field>

            <v-text-field v-model="chatId" :rules="chatIdRules" label="Введіть ID Вашого чату" required></v-text-field>

            <v-btn :disabled="!valid" color="primary" @click="submit">Ввійти до чату</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from "vuex"
export default {
  layout: "empty",
  head: {
    title: "Welcome to the Encrypt-Chat"
  },
  sockets: {
    connect: function() {
      console.log("socket connected")
    }
  },
  data: () => ({
    valid: true,
    snackbar: false,
    message: "",
    name: "",
    nameRules: [
      v => !!v || "Login is required",
      v => (v && v.length <= 16) || "Name can`t be > 16 letters"
    ],
    chatId: "",
    chatIdRules: [v => !!v || "Chat ID is required"]
  }),
  mounted() {
    const { message } = this.$route.query
    if (message === "noUser") {
      this.message = "No data"
    } else if (message === "leftChat") {
      this.message = "U leave a chat"
    }

    this.snackbar = !!this.message
  },
  methods: {
    ...mapMutations(["setUser"]),
    submit() {
      if (this.$refs.form.validate()) {
        const user = {
          name: this.name,
          chatId: this.chatId
        }

        this.$socket.emit("userJoined", user, data => {
          if (typeof data === "string") {
            console.error(data)
          } else {
            user.id = data.userId
            this.setUser(user)
            this.$router.push("/chat_pages")
          }
        })
      }
    }
  }
}
</script>
