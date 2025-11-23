<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <Header :role="role" />
    <div class="flex flex-1">
      <Sidebar :role="role" />
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '~/components/Sidebar.vue';
import Header from '~/components/Header.vue';
import { useAuth } from '~/composables/useAuth';
const { user } = useAuth();
const role = user?.role || 'user';
</script>

<style scoped>
/* Modern dashboard layout */
.min-h-screen {
  min-height: 100vh;
}
main {
  background: #f8fafc;
  border-radius: 1rem;
  margin: 2rem 1rem;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
}
</style>
