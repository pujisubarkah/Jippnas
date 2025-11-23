<template>
  <header class="w-full bg-white shadow-sm px-8 py-4 flex items-center justify-between relative">
    <div class="flex items-center gap-3">
      <span class="text-2xl font-bold text-blue-700">Jippnas Admin</span>
      <span v-if="user?.role === 'admin'" class="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">Admin</span>
      <span v-else class="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">User</span>
    </div>
    <div class="flex items-center gap-4 relative">
      <!-- Notification Icons -->
      <button class="relative p-2 text-blue-700 hover:bg-blue-100 rounded-full transition">
        <component :is="Bell" class="w-5 h-5" />
        <!-- Badge for unread notifications -->
        <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
      </button>
      <button class="relative p-2 text-blue-700 hover:bg-blue-100 rounded-full transition">
        <component :is="Mail" class="w-5 h-5" />
        <!-- Badge for unread messages -->
        <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">5</span>
      </button>
      <div class="relative">
        <button @click="toggleDropdown" class="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded font-semibold hover:bg-blue-200 transition">
          <span>{{ user?.username || user?.name || 'User' }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <transition name="fade">
          <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-10">
            <button @click="openChangePassword" class="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-700">Ganti Password</button>
            <button @click="handleLogoutAndClose" class="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600">Logout</button>
          </div>
        </transition>
          <!-- Modal Ganti Password -->
          <transition name="fade">
            <div v-if="showChangePassword" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <h2 class="text-xl font-bold mb-4">Ganti Password</h2>
                <form @submit.prevent="submitChangePassword" class="flex flex-col gap-4">
                  <input v-model="changePasswordForm.oldPassword" type="password" placeholder="Password Lama" required class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  <input v-model="changePasswordForm.newPassword" type="password" placeholder="Password Baru" required class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  <input v-model="changePasswordForm.confirmPassword" type="password" placeholder="Konfirmasi Password Baru" required class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  <div class="flex justify-end gap-2">
                    <button type="button" @click="closeChangePassword" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Batal</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Simpan</button>
                  </div>
                </form>
                <div v-if="changePasswordError" class="text-red-600 mt-2">{{ changePasswordError }}</div>
                <div v-if="changePasswordSuccess" class="text-green-600 mt-2">{{ changePasswordSuccess }}</div>
              </div>
            </div>
          </transition>
      </div>
    </div>
    <transition name="fade">
      <div v-if="loggingOut" class="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
        <span class="text-blue-600 text-lg font-semibold animate-pulse">Logging out...</span>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({ role: { type: String, default: 'user' } });
import { useAuth } from '~/composables/useAuth';
import { useRouter } from 'vue-router';
import { Bell, Mail } from 'lucide-vue-next';
const { logout, user } = useAuth();
const router = useRouter();
const showDropdown = ref(false);
const loggingOut = ref(false);
const showChangePassword = ref(false);
const changePasswordForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' });
const changePasswordError = ref('');
const changePasswordSuccess = ref('');

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}
function handleLogoutAndClose() {
  showDropdown.value = false;
  loggingOut.value = true;
  setTimeout(() => {
    logout();
    router.push('/');
    loggingOut.value = false;
  }, 600);
}
function openChangePassword() {
  showDropdown.value = false;
  showChangePassword.value = true;
  changePasswordError.value = '';
  changePasswordSuccess.value = '';
  changePasswordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
}
function closeChangePassword() {
  showChangePassword.value = false;
}
async function submitChangePassword() {
  changePasswordError.value = '';
  changePasswordSuccess.value = '';
  const { oldPassword, newPassword, confirmPassword } = changePasswordForm.value;
  if (!oldPassword || !newPassword || !confirmPassword) {
    changePasswordError.value = 'Semua field wajib diisi.';
    return;
  }
  if (newPassword !== confirmPassword) {
    changePasswordError.value = 'Konfirmasi password tidak cocok.';
    return;
  }
  // TODO: Call API to change password
  // Example:
  // const res = await $fetch('/api/change-password', { method: 'POST', body: { oldPassword, newPassword } });
  // if (res.success) { changePasswordSuccess.value = 'Password berhasil diubah.' } else { changePasswordError.value = res.error }
  setTimeout(() => {
    changePasswordSuccess.value = 'Password berhasil diubah (simulasi).';
    changePasswordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
  }, 1000);
}
</script>

<style scoped>
/* Custom header styles */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
