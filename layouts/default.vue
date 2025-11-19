<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
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