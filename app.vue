<template>
  <NuxtLayout>
    <NuxtPage />
    <ClientOnly>
      <Toaster />
    </ClientOnly>
  </NuxtLayout>
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
