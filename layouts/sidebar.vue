<template>
  <v-app class="dashboard-layout">
    <Header :role="role" :sidebar-open="sidebarOpen" @toggle-sidebar="toggleSidebar" />
    <Sidebar :role="role" :sidebar-open="sidebarOpen" />

    <v-main :class="['main-content', { 'sidebar-closed': !sidebarOpen }]">
      <div class="full-content">
        <slot />
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import Sidebar from '~/components/Sidebar.vue';
import Header from '~/components/Header.vue';
import { useAuth } from '~/composables/useAuth';
import { computed, ref } from 'vue';

const { user } = useAuth();
const role = computed(() => user.value?.role || 'user');

// Sidebar state
const sidebarOpen = ref(true);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>

<style scoped>
.dashboard-layout {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

.main-content {
  margin-top: 80px; /* Account for fixed header */
  padding-top: 24px; /* Additional space from header */
}

.full-content {
  width: 100%;
  min-height: calc(100vh - 104px); /* 80px header + 24px padding */
  padding: 24px 48px;
  box-sizing: border-box;
  max-width: 1400px;
  margin: 0 auto;
}


/* Content is full screen with overlay sidebar */
@media (min-width: 1024px) {
  /* Add styles for .main-content and .sidebar-closed here if needed */
}

@media (max-width: 1023px) {
  /* Add styles for .main-content and .sidebar-closed here if needed */
}
</style>
