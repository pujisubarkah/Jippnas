<template>
  <aside class="w-64 min-h-screen bg-[#C2E7F6] shadow-lg flex flex-col py-6 px-4 border-r-4 border-yellow-600">
    <h2 class="text-xl font-bold mb-6 text-blue-700">Menu</h2>
    <nav>
      <ul class="space-y-2">
        <li v-if="!role" class="text-blue-700 px-4 py-2">Memuat data user...</li>
        <li v-else-if="menu.length === 0" class="text-blue-700 px-4 py-2">Menu tidak tersedia untuk role ini.</li>
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
import { computed, watch, onMounted } from 'vue';
import { Home, Users, Video, Newspaper, Lightbulb, Plus } from 'lucide-vue-next';
import { useAuth } from '~/composables/useAuth';
const { user, checkAuth } = useAuth();
const role = computed(() => user.value?.role);

// Ensure auth is checked on mount
onMounted(() => {
  checkAuth();
});

// Watch for user changes to update menu
watch(user, (newUser) => {
  // console.log('User updated in Sidebar:', newUser);
  // console.log('Role updated in Sidebar:', newUser?.role);
}, { immediate: true });

// Universal menu config with slug
const menuConfig = [
  // Admin menu
  {
    label: 'Dashboard',
    slug: 'dashboard',
    icon: Home,
    roles: ['admin']
  },
  {
    label: 'Management User',
    slug: 'users',
    icon: Users,
    roles: ['admin']
  },
  {
    label: 'Webinar',
    slug: 'webinar',
    icon: Video,
    roles: ['admin']
  },
  {
    label: 'Berita',
    slug: 'berita',
    icon: Newspaper,
    roles: ['admin']
  },
  {
    label: 'Inovasi',
    slug: 'inovasi',
    icon: Lightbulb,
    roles: ['admin']
  },
  // User menu
  {
    label: 'Dashboard',
    slug: 'dashboard',
    icon: Home,
    roles: ['user']
  },
  {
    label: 'Tambah Inovasi',
    slug: 'tambah-inovasi',
    icon: Plus,
    roles: ['user']
  }
];

const menu = computed(() => {
  if (!role.value) return [];
  return menuConfig
    .filter(item => item.roles.includes(role.value))
    .map(item => ({
      ...item,
      to: `/${role.value}/${item.slug}`
    }));
});
</script>

<style scoped>
/* Sidebar styles */
</style>
