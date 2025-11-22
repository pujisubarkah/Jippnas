<template>
  <div class="flex min-h-screen bg-gray-100">
    <Sidebar :role="role" />
    <main class="flex-1 p-8">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-blue-700">{{ role === 'admin' ? 'Admin Dashboard' : 'User Menu' }}</h1>
      </header>
      <div v-if="role === 'admin'">
        <p class="mb-4">Selamat datang di dashboard admin. Silakan pilih menu di sidebar untuk mengelola data.</p>
        <!-- Contoh konten admin -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-2">Statistik Pengguna</h2>
            <p class="text-gray-600">Total user: 120</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-2">Webinar Terbaru</h2>
            <p class="text-gray-600">Judul: Webinar Inovasi 2025</p>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="mb-4">Selamat datang di halaman user. Silakan pilih menu di sidebar untuk menambah inovasi.</p>
        <!-- Contoh konten user -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-2">Tambah Inovasi</h2>
          <p class="text-gray-600">Klik menu di sidebar untuk mulai menambah inovasi baru.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'sidebar' })
import Sidebar from '~/components/Sidebar.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
// role: 'admin' or 'user' based on slug
const role = route.params.slug === 'admin' ? 'admin' : 'user';
</script>

<style scoped>
/* Custom styles for detail page */
</style>
