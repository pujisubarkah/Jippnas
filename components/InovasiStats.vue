<template>
  <div class="py-8 text-center">
    <h1 class="text-4xl font-bold text-blue-800">Inovasi Pelayanan Publik</h1>
    <p class="text-blue-600">*sampai saat ini</p>
    <div class="flex flex-wrap justify-center mt-4 space-x-8 text-blue-800">
      <div class="flex flex-col items-center mb-6">
        <i class="fas fa-building text-4xl mb-2"></i>
        <h3 class="text-6xl font-bold pt-2">320</h3>
        <p>Instansi</p>
      </div>
      <div class="flex flex-col items-center mb-6">
        <i class="fas fa-lightbulb text-4xl mb-2"></i>
        <h3 class="text-6xl font-bold pt-2">2928</h3>
        <p>Inovasi</p>
      </div>
      <div class="flex flex-col items-center mb-6">
        <i class="fas fa-clone text-4xl mb-2"></i>
        <h3 class="text-6xl font-bold pt-2">20940</h3>
        <p>Replikasi Inovasi</p>
      </div>
    </div>
    <div class="flex justify-center my-4">
      <NuxtLink to="/etalase" class="btn btn-lg btn-primary px-8 py-3 rounded max-w-sm">Lihat Etalase Inovasi</NuxtLink>
    </div>
  </div>
</template>

<script setup>
// No script needed for this static component
</script>