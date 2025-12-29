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
          User
        </v-chip>
      </v-toolbar-title>

      <v-spacer />

      <!-- Notification Icons -->
      <div class="d-flex align-center ga-2">
        <v-btn
          icon
          variant="text"
          color="primary"
          class="mx-1"
          :aria-label="'Notifikasi - 3 pesan belum dibaca'"
        >
          <v-icon>mdi-bell</v-icon>
          <v-badge
            color="error"
            content="3"
            floating
            offset-x="8"
            offset-y="8"
          ></v-badge>
        </v-btn>

        <v-btn
          icon
          variant="text"
          color="primary"
          class="mx-1"
          :aria-label="'Pesan - 5 pesan belum dibaca'"
        >
          <v-icon>mdi-email</v-icon>
          <v-badge
            color="error"
            content="5"
            floating
            offset-x="8"
            offset-y="8"
          ></v-badge>
        </v-btn>

        <!-- User Menu -->
        <v-menu
          v-model="showDropdown"
          :close-on-content-click="false"
          location="bottom end"
          offset-y
        >
          <template v-slot:activator="{ props }">
            <v-btn
              variant="outlined"
              color="primary"
              class="ml-2"
              v-bind="props"
              :aria-label="'Menu pengguna - ' + (user?.username || user?.name || 'User')"
            >
              <span class="mr-2">{{ user?.username || user?.name || 'User' }}</span>
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list density="comfortable">
            <v-list-item @click="openChangePassword">
              <template v-slot:prepend>
                <v-icon>mdi-lock-reset</v-icon>
              </template>
              <v-list-item-title>Ganti Password</v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-list-item @click="handleLogout" :disabled="loggingOut">
              <template v-slot:prepend>
                <v-icon color="error">mdi-logout</v-icon>
              </template>
              <v-list-item-title class="text-error">
                {{ loggingOut ? 'Logging out...' : 'Logout' }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
              :rules="[
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
import { ref } from 'vue'
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

// Methods
const handleLogout = () => {
  showDropdown.value = false
  loggingOut.value = true
  setTimeout(() => {
    logout()
    router.push('/')
    loggingOut.value = false
  }, 600)
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
  // Example:
  // const res = await $fetch('/api/change-password', { method: 'POST', body: { oldPassword, newPassword } });
  // if (res.success) { changePasswordSuccess.value = 'Password berhasil diubah.' } else { changePasswordError.value = res.error }

  // Simulate API call
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
</script>

<style scoped>
.header-custom {
  border-bottom: 3px solid #1976D2;
}

.header-custom .v-toolbar__content {
  border-bottom: 3px solid #1976D2;
}

/* Custom animations for Vuetify transitions */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* Loading state styling */
.v-btn--loading .v-btn__content {
  opacity: 0.8;
}
</style>
