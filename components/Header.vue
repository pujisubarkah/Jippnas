<template>
  <header class="w-full bg-white shadow-sm px-8 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <span class="text-2xl font-bold text-blue-700">Jippnas Admin</span>
      <span v-if="role === 'admin'" class="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">Admin</span>
      <span v-else class="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">User</span>
    </div>
    <div class="flex items-center gap-4 relative">
      <div class="relative">
        <button @click="toggleDropdown" class="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded font-semibold hover:bg-blue-200 transition">
          <span>{{ user?.name || 'User' }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-10">
          <button @click="handleChangePasswordAndClose" class="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-700">Ganti Password</button>
          <button @click="handleLogoutAndClose" class="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600">Logout</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({ role: { type: String, default: 'user' } });
import { useAuth } from '~/composables/useAuth';
const { logout, user } = useAuth();
const showDropdown = ref(false);
function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}
function handleLogoutAndClose() {
  showDropdown.value = false;
  logout();
  window.location.href = '/';
}
function handleChangePasswordAndClose() {
  showDropdown.value = false;
  alert('Fitur ganti password belum tersedia.');
}
</script>

<style scoped>
/* Custom header styles */
</style>
