<template>
  <v-app-bar
    app
    elevation="1"
    color="white"
    height="80"
    class="header-custom"
  >
    <v-container fluid class="d-flex align-center pa-0 px-4">
      <!-- Hamburger Menu for Sidebar -->
      <v-btn
        icon
        variant="text"
        color="primary"
        class="mr-2"
        @click="$emit('toggle-sidebar')"
        :aria-label="'Toggle sidebar'"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <!-- Logo/Title -->
      <v-toolbar-title class="d-flex align-center">
        <span class="text-h6 font-weight-bold text-primary mr-3">
          Jippnas Admin
        </span>
        <ClientOnly>
          <v-chip
            v-if="user?.role === 'admin'"
            color="primary"
            variant="flat"
            size="small"
            class="font-weight-medium"
          >
            Admin
          </v-chip>
          <v-chip
            v-else
            color="success"
            variant="flat"
            size="small"
            class="font-weight-medium"
          >
            {{ user?.name || user?.username || 'User' }}
          </v-chip>
        </ClientOnly>
      </v-toolbar-title>

      <v-spacer />

      <!-- Notification Icons -->
      <div class="d-flex align-center ga-2">
        <!-- Notifications Dropdown -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              color="primary"
              class="mx-1"
              :aria-label="`Notifikasi - ${unreadNotifications.length} pesan belum dibaca`"
            >
              <v-icon>mdi-bell</v-icon>
              <v-badge
                v-if="unreadNotifications.length > 0"
                color="error"
                :content="unreadNotifications.length"
                floating
                offset-x="8"
                offset-y="8"
              ></v-badge>
            </v-btn>
          </template>

          <v-card width="400" class="notification-dropdown">
            <v-card-title class="text-h6 font-weight-bold text-primary">
              Notifikasi
              <v-spacer />
              <v-btn icon small variant="text" @click="markAllNotificationsAsRead">
                <v-icon>mdi-check-all</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-0">
              <v-list>
                <v-list-item
                  v-for="notification in notifications"
                  :key="notification.id"
                  :class="{ 'bg-blue-lighten-5': !notification.read }"
                  @click="markNotificationAsRead(notification)"
                >
                  <template v-slot:prepend>
                    <v-icon :color="notification.type === 'success' ? 'success' : notification.type === 'warning' ? 'warning' : 'primary'">
                      {{ notification.icon }}
                    </v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">{{ notification.title }}</v-list-item-title>
                  <v-list-item-subtitle class="text-caption">{{ notification.message }}</v-list-item-subtitle>
                  <v-list-item-subtitle class="text-caption text-grey">{{ formatDate(notification.createdAt) }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item v-if="notifications.length === 0">
                  <v-list-item-title class="text-center text-grey">Tidak ada notifikasi</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-menu>

        <!-- Messages Dropdown -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              color="primary"
              class="mx-1"
              :aria-label="`Pesan - ${unreadMessages.length} pesan belum dibaca`"
            >
              <v-icon>mdi-email</v-icon>
              <v-badge
                v-if="unreadMessages.length > 0"
                color="error"
                :content="unreadMessages.length"
                floating
                offset-x="8"
                offset-y="8"
              ></v-badge>
            </v-btn>
          </template>

          <v-card width="400" class="message-dropdown">
            <v-card-title class="text-h6 font-weight-bold text-primary">
              Pesan
              <v-spacer />
              <v-btn icon small variant="text" @click="markAllMessagesAsRead">
                <v-icon>mdi-check-all</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-0">
              <v-list>
                <v-list-item
                  v-for="message in messages"
                  :key="message.id"
                  :class="{ 'bg-blue-lighten-5': !message.read }"
                  @click="markMessageAsRead(message)"
                >
                  <template v-slot:prepend>
                    <v-avatar size="40">
                      <v-img :src="message.senderAvatar || '/default-avatar.png'" />
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-body-2">{{ message.sender }}</v-list-item-title>
                  <v-list-item-subtitle class="text-caption">{{ message.subject }}</v-list-item-subtitle>
                  <v-list-item-subtitle class="text-caption text-grey">{{ formatDate(message.createdAt) }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item v-if="messages.length === 0">
                  <v-list-item-title class="text-center text-grey">Tidak ada pesan</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-menu>

        <!-- User Menu -->
        <ClientOnly>
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                class="ml-2"
                variant="text"
                color="primary"
              >
                <v-icon start>mdi-account-circle</v-icon>
                {{ user?.name || user?.username || 'User' }}
                <v-icon end>mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Settings</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="handleLogout">
                <v-list-item-title class="text-error">Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </ClientOnly>
      </div>
    </v-container>

    <!-- Change Password Dialog -->
    <v-dialog
      v-model="showChangePassword"
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title class="text-h6 font-weight-bold text-primary">
          Ganti Password
          <v-spacer />
          <v-btn
            icon
            variant="text"
            @click="closeChangePassword"
            :aria-label="'Tutup dialog ganti password'"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="submitChangePassword" class="mt-4">
            <v-text-field
              v-model="changePasswordForm.oldPassword"
              type="password"
              label="Password Lama"
              variant="outlined"
              :rules="[v => !!v || 'Password lama wajib diisi']"
              required
              prepend-inner-icon="mdi-lock"
              class="mb-4"
            />

            <v-text-field
              v-model="changePasswordForm.newPassword"
              type="password"
              label="Password Baru"
              variant="outlined"
              :rules="[v => !!v || 'Password baru wajib diisi']"
              required
              prepend-inner-icon="mdi-lock-plus"
              class="mb-4"
            />

            <v-text-field
              v-model="changePasswordForm.confirmPassword"
              type="password"
              label="Konfirmasi Password Baru"
              variant="outlined"
              :rules=" [
                v => !!v || 'Konfirmasi password wajib diisi',
                v => v === changePasswordForm.newPassword || 'Konfirmasi password tidak cocok'
              ]"
              required
              prepend-inner-icon="mdi-lock-check"
              class="mb-4"
            />

            <v-alert
              v-if="changePasswordError"
              type="error"
              class="mb-4"
              variant="tonal"
            >
              {{ changePasswordError }}
            </v-alert>

            <v-alert
              v-if="changePasswordSuccess"
              type="success"
              class="mb-4"
              variant="tonal"
            >
              {{ changePasswordSuccess }}
            </v-alert>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn
            variant="outlined"
            @click="closeChangePassword"
            class="mr-2"
          >
            Batal
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="submitChangePassword"
            :loading="submitting"
          >
            Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const props = defineProps({
  role: {
    type: String,
    default: 'user'
  }
})

const { logout, user } = useAuth()
const router = useRouter()

// Reactive states
const showDropdown = ref(false)
const loggingOut = ref(false)
const showChangePassword = ref(false)
const submitting = ref(false)
const changePasswordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const changePasswordError = ref('')
const changePasswordSuccess = ref('')

// Notifications state
const notifications = ref([
  {
    id: 1,
    title: 'Survey Baru Tersedia',
    message: 'Survey Hub Inovasi untuk periode 2026 telah dibuka',
    type: 'info',
    icon: 'mdi-clipboard-text',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: 2,
    title: 'Inovasi Disetujui',
    message: 'Inovasi "Sistem Digitalisasi Layanan" telah disetujui',
    type: 'success',
    icon: 'mdi-check-circle',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
  },
  {
    id: 3,
    title: 'Deadline Mendekat',
    message: 'Deadline pengumpulan inovasi tinggal 3 hari lagi',
    type: 'warning',
    icon: 'mdi-clock-alert',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  }
])

// Messages state
const messages = ref([
  {
    id: 1,
    sender: 'Admin JIPPNAS',
    senderAvatar: null,
    subject: 'Pembaruan Sistem',
    content: 'Sistem akan mengalami maintenance pada tanggal 15 Januari 2026',
    read: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
  },
  {
    id: 2,
    sender: 'Tim Verifikasi',
    senderAvatar: null,
    subject: 'Hasil Verifikasi Inovasi',
    content: 'Inovasi Anda telah diverifikasi dengan skor 85/100',
    read: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
  },
  {
    id: 3,
    sender: 'Koordinator Wilayah',
    senderAvatar: null,
    subject: 'Undangan Webinar',
    content: 'Anda diundang untuk mengikuti webinar inovasi daerah',
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  }
])

// Computed properties
const unreadNotifications = computed(() => notifications.value.filter(n => !n.read))
const unreadMessages = computed(() => messages.value.filter(m => !m.read))

// Methods
const handleLogout = () => {
  showDropdown.value = false
  loggingOut.value = true
  logout()
  router.push('/')
  loggingOut.value = false
}

const openChangePassword = () => {
  showDropdown.value = false
  showChangePassword.value = true
  changePasswordError.value = ''
  changePasswordSuccess.value = ''
  changePasswordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const closeChangePassword = () => {
  showChangePassword.value = false
}

const submitChangePassword = async () => {
  changePasswordError.value = ''
  changePasswordSuccess.value = ''
  submitting.value = true

  const { oldPassword, newPassword, confirmPassword } = changePasswordForm.value

  if (!oldPassword || !newPassword || !confirmPassword) {
    changePasswordError.value = 'Semua field wajib diisi.'
    submitting.value = false
    return
  }

  if (newPassword !== confirmPassword) {
    changePasswordError.value = 'Konfirmasi password tidak cocok.'
    submitting.value = false
    return
  }

  // TODO: Call API to change password
  setTimeout(() => {
    changePasswordSuccess.value = 'Password berhasil diubah (simulasi).'
    changePasswordForm.value = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    submitting.value = false
  }, 1000)
}

// Notification methods
const markNotificationAsRead = (notification) => {
  notification.read = true
  // TODO: Call API to mark as read
  console.log('Marked notification as read:', notification.id)
}

const markAllNotificationsAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
  // TODO: Call API to mark all as read
  console.log('Marked all notifications as read')
}

// Message methods
const markMessageAsRead = (message) => {
  message.read = true
  // TODO: Call API to mark as read
  console.log('Marked message as read:', message.id)
}

const markAllMessagesAsRead = () => {
  messages.value.forEach(message => {
    message.read = true
  })
  // TODO: Call API to mark all as read
  console.log('Marked all messages as read')
}

// Utility methods
const formatDate = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes} menit yang lalu`
  if (hours < 24) return `${hours} jam yang lalu`
  if (days < 7) return `${days} hari yang lalu`
  return new Date(date).toLocaleDateString('id-ID')
}
</script>

<style scoped>
.header-custom {
  border-bottom: 3px solid #1976D2;
}

.header-custom .v-toolbar__content {
  border-bottom: 3px solid #1976D2;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-btn--loading .v-btn__content {
  opacity: 0.8;
}
</style>
