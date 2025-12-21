<template>
  <v-app>
    <NuxtLayout>
      <div class="max-w-7xl mx-auto">
        <NuxtPage />
      </div>
      <ClientOnly>
        <Toaster />
      </ClientOnly>
    </NuxtLayout>
  </v-app>
</template>

<script setup>
import './main.css'
import { Toaster } from 'vue-sonner'

// Initialize auth on app start
import { useAuth } from '~/composables/useAuth'
const { checkAuth } = useAuth()

onMounted(() => {
  checkAuth()
})
</script>
