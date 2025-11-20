<template>
  <div class="min-h-screen flex flex-col">
    <Navbar class="sticky top-0 z-50" />
    <main class="grow">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'
</script>