<template>
  <aside class="w-64 h-full bg-white shadow-lg flex flex-col py-6 px-4">
    <h2 class="text-xl font-bold mb-6 text-blue-700">Menu</h2>
    <nav>
      <ul class="space-y-2">
        <li v-for="item in menu" :key="item.label">
          <NuxtLink :to="item.to" class="block px-4 py-2 rounded hover:bg-blue-50 text-blue-800 font-medium">
            <span class="inline-flex items-center gap-2">
              <component :is="item.icon" v-if="item.icon" class="w-5 h-5" />
              {{ item.label }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
// Props: role = 'admin' | 'user'
import { computed } from 'vue';
import { Home, Users, Video, Newspaper, Lightbulb, Plus } from 'lucide-vue-next';
const props = defineProps({ role: { type: String, default: 'user' } });

const adminMenu = [
  { label: 'Dashboard', to: '/admin', icon: Home },
  { label: 'Management User', to: '/admin/users', icon: Users },
  { label: 'Webinar', to: '/admin/webinar', icon: Video },
  { label: 'Berita', to: '/admin/berita', icon: Newspaper },
  { label: 'Inovasi', to: '/admin/inovasi', icon: Lightbulb },
];
const userMenu = [
  { label: 'Tambah Inovasi', to: '/user/tambah-inovasi', icon: Plus },
];

const menu = computed(() => props.role === 'admin' ? adminMenu : userMenu);
</script>

<style scoped>
/* Sidebar styles */
</style>
