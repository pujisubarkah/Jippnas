<template>
  <li class="relative">
    <button
      @click="showMenu = !showMenu"
      class="link link-hover cursor-pointer text-blue-800 hover:text-blue-700 transition duration-300 flex items-center space-x-1"
    >
      <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          v-if="label === 'Tautan Terkait'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
        <path
          v-else-if="label === 'Bantuan'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <path
          v-else-if="label === 'Knowledge Center'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span>{{ label }}</span>
    </button>

    <ul
      v-show="showMenu"
      class="absolute top-full left-0 z-50 menu menu-sm shadow-xl bg-white rounded-box w-56 border border-blue-200 p-3"
      :class="label === 'Tautan Terkait' ? 'bg-blue-50' : ''"
    >
      <li v-for="item in items" :key="item.label">
        <a
          :href="item.href"
          @click="showMenu = false"
          class="link text-blue-800 hover:bg-blue-100 px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2"
        >
          <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              v-if="item.label === 'Materi / Modul'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 19.5A2.5 2.5 0 006.5 22h11a2.5 2.5 0 002.5-2.5V6.5A2.5 2.5 0 0017.5 4h-11A2.5 2.5 0 004 6.5v13z"/>
            <path
              v-else-if="item.label === 'Forum Diskusi'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V10a2 2 0 012-2h2"/>
            <path
              v-else-if="item.label === 'Quiz & Ujian'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
            <path
              v-else-if="item.label === 'Sertifikat'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"/>
            <path
              v-else-if="item.label === 'Progress Belajar'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 20v-6m0 0V4m0 10h6m-6 0H6"/>
            <path
              v-else-if="item.label === 'Event / Webinar'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            <path
              v-else-if="item.label === 'Resource / Library'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 19.5A2.5 2.5 0 006.5 22h11a2.5 2.5 0 002.5-2.5V6.5A2.5 2.5 0 0017.5 4h-11A2.5 2.5 0 004 6.5v13z"/>
            <path
              v-else-if="item.label === 'Mentor'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 8a6 6 0 10-12 0h12z"/>
            <path
              v-else-if="item.label === 'Tugas / Assignment'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6"/>
            />
            <!-- ...existing code for other menu icons... -->
          </svg>
          <span>{{ item.label }}</span>
        </a>
      </li>
    </ul>
  </li>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  label: String,
  items: Array
});

const showMenu = ref(false);
</script>