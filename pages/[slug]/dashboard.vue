<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 text-blue-700">Dashboard {{ role === 'admin' ? 'Admin' : 'User' }}</h2>
    <div v-if="role === 'admin'">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">Statistik Pengguna</h3>
          <p class="text-gray-600">Total user: 120</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">Webinar Terbaru</h3>
          <p class="text-gray-600">Judul: Webinar Inovasi 2025</p>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">Selamat Datang User</h3>
        <p class="text-gray-600">Silakan pilih menu di sidebar untuk menambah inovasi.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'sidebar' })
import { useRoute } from 'vue-router';
const route = useRoute();
const role = route.params.slug === 'admin' ? 'admin' : 'user';
</script>

<style scoped>
/* Custom dashboard styles */
</style>
