<template>
  <div class="min-h-screen flex flex-col">
    <Navbar class="sticky top-0 z-50" />
    <main class="grow pt-20">
      <NuxtPage />
    </main>
    <Footer />
    <!-- Go To Top -->
    <button
      class="fixed bottom-6 right-6 z-60 rounded-full p-3 md:p-4 shadow-lg bg-linear-to-r from-blue-600 via-blue-500 to-blue-700 text-white border border-amber-300/60 hover:from-blue-600 hover:to-blue-800 hover:shadow-xl transition duration-300 transform"
      :class="showToTop ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'"
      @click="goToTop"
      aria-label="Kembali ke atas"
    >
      <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showToTop = ref(false)
const onScroll = () => { showToTop.value = typeof window !== 'undefined' && window.scrollY > 200 }

const goToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>