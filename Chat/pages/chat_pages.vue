<template>
  <div class="c-wrap">
    <div class="c-chat" ref="block">
      <Message v-for="m in messages" :key="m.text" :name="m.name" :text="m.text" :owner="m.id === user.id"/>
    </div>
    <div class="c-form">
      <formChat/>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import Message from "@/components/message"
import formChat from "@/components/formChat"
export default {
  middleware: ["chat"],
  head() {
    return {
      title: `Chat ID - ${this.user.chatId}`
    }
  },
  components: { Message, formChat },
  computed: mapState(["user", "messages"]),
  watch: {
    messages() {
      setTimeout(() => {
        this.$refs.block.scrollTop = this.$refs.block.scrollHeight
      })
    }
  }
}
</script>

<style scoped>
.c-wrap {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.c-form {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  height: 80px;
}

.c-chat {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 80px;
  padding: 1rem;
  overflow-y: auto;
}
</style>