<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-4 flex items-center h-16">
        <div class="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mr-4">
          <span class="text-2xl">🎥</span>
        </div>
        <h1 class="text-3xl font-extrabold bg-linear-to-r from-purple-800 via-purple-700 to-blue-600 bg-clip-text text-transparent">
          Detail Event
        </h1>
      </div>
    </header>
    <div class="max-w-2xl mx-auto px-4 py-8">
      <NuxtLink to="/event" class="inline-block px-4 py-2 mb-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold text-center">Kembali ke Event</NuxtLink>
      <div v-if="event" class="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
        <img :src="event.image" :alt="event.title" class="w-full h-56 object-cover" />
        <div class="p-6 flex-1 flex flex-col">
          <h2 class="text-2xl font-bold mb-2">{{ event.title }}</h2>
          <span class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold w-fit mb-2">{{ event.type }}</span>
          <p class="text-gray-500 text-sm mb-2">{{ new Date(event.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
          <p class="text-gray-700 mb-4">{{ event.description }}</p>
        </div>
      </div>
      <div v-else class="text-center py-16 text-gray-500">
        Event tidak ditemukan.
      </div>
    </div>
  </div>
</template>
<script setup>

import { useRoute } from 'vue-router';
const events = [
  {
    id: 1,
    title: 'Webinar Inovasi Pelayanan Publik',
    type: 'Webinar',
    date: '2025-12-01',
    description: 'Webinar membahas inovasi pelayanan publik daerah yang sukses meningkatkan efisiensi dan kualitas layanan.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    title: 'Podcast Kolaborasi Daerah',
    type: 'Podcast',
    date: '2025-12-10',
    description: 'Podcast kolaborasi antar daerah untuk berbagi pengalaman dan strategi inovasi pelayanan.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    title: 'Workshop Digitalisasi Layanan',
    type: 'Workshop',
    date: '2025-12-15',
    description: 'Workshop tentang digitalisasi layanan publik untuk aparatur pemerintah daerah.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
  },
];

const route = useRoute();
const eventId = Number(route.params.id);
const event = events.find(e => e.id === eventId);
</script>
