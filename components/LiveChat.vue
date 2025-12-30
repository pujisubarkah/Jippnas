<template>
  <div class="fixed bottom-4 right-4 z-50">
    <button
      @click="toggleChat"
      class="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
    >
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
    </button>

    <div v-if="isOpen" class="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
      <div class="bg-blue-600 text-white p-4 rounded-t-lg">
        <h3 class="font-semibold">Live Chat - {{ materi.title }}</h3>
      </div>

      <div class="flex-1 p-4 overflow-y-auto" ref="messagesContainer">
        <div v-for="msg in messages" :key="msg.id" class="mb-3">
          <div class="flex items-start gap-2">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
              {{ msg.username.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-800">{{ msg.username }}</p>
              <p class="text-sm text-gray-700 bg-gray-100 p-2 rounded-lg">{{ msg.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatTime(msg.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 border-t border-gray-200">
        <div class="flex gap-2">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Ketik pesan..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="sendMessage"
            :disabled="!newMessage.trim()"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  materi: {
    type: Object,
    required: true
  }
})

const { isLoggedIn, user } = useAuth()

const isOpen = ref(false)
const messages = ref([])
const newMessage = ref('')
const messagesContainer = ref(null)
const pollInterval = ref(null)

onMounted(() => {
  loadMessages()
  // Poll for new messages every 3 seconds
  pollInterval.value = setInterval(loadMessages, 3000)
})

onUnmounted(() => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
})

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => scrollToBottom())
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !isLoggedIn.value) return

  const message = {
    courseId: props.materi.id,
    userId: user.value.id,
    username: user.value.username,
    message: newMessage.value.trim(),
    createdAt: new Date()
  }

  try {
    await $fetch('/api/chat/messages', {
      method: 'POST',
      body: message
    })
    newMessage.value = ''
    // Immediately load messages to show the new one
    loadMessages()
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}

const loadMessages = async () => {
  try {
    const msgs = await $fetch(`/api/chat/messages?courseId=${props.materi.id}`)
    // Only update if there are new messages
    if (msgs.length !== messages.value.length) {
      messages.value = msgs
      if (isOpen.value) {
        nextTick(() => scrollToBottom())
      }
    }
  } catch (error) {
    console.error('Failed to load messages:', error)
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>