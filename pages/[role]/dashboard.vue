<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 text-blue-700">Dashboard {{ role }}</h2>
    <p>Role: {{ role }}</p>
    <p>Params: {{ JSON.stringify(route.params) }}</p>
    <div v-if="role === 'admin'">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2 text-blue-700">Statistik Pengguna</h3>
          <p class="text-3xl font-bold text-blue-600">120</p>
          <p class="text-gray-600">Total user terdaftar</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2 text-green-700">Webinar Terbaru</h3>
          <p class="text-lg font-medium">Webinar Inovasi 2025</p>
          <p class="text-gray-600">Tanggal: 25 Nov 2025</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2 text-purple-700">Berita Terbaru</h3>
          <p class="text-lg font-medium">Update Sistem Inovasi</p>
          <p class="text-gray-600">Diterbitkan: 22 Nov 2025</p>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4 text-blue-700">Aktivitas Terbaru</h3>
          <ul class="space-y-2">
            <li class="flex justify-between">
              <span>User baru mendaftar</span>
              <span class="text-gray-500">2 jam lalu</span>
            </li>
            <li class="flex justify-between">
              <span>Webinar baru dibuat</span>
              <span class="text-gray-500">1 hari lalu</span>
            </li>
            <li class="flex justify-between">
              <span>Berita diperbarui</span>
              <span class="text-gray-500">3 hari lalu</span>
            </li>
          </ul>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4 text-green-700">Quick Actions</h3>
          <div class="space-y-3">
            <NuxtLink to="/admin/users" class="block bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded transition">
              Kelola Pengguna
            </NuxtLink>
            <NuxtLink to="/admin/webinar" class="block bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded transition">
              Buat Webinar Baru
            </NuxtLink>
            <NuxtLink to="/admin/berita" class="block bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded transition">
              Tambah Berita
            </NuxtLink>
          </div>
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
const role = route.params.role === 'admin' ? 'admin' : 'user';
console.log('Dashboard route params:', route.params);
console.log('Dashboard role:', role);
</script>

<style scoped>
/* Custom dashboard styles */
</style>
