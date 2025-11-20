<template>
  <div class="py-12 text-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-amber-50">
    <!-- ornament -->
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -top-10 -left-10 w-56 h-56 rounded-full bg-blue-200/30 blur-2xl"></div>
      <div class="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-amber-200/30 blur-3xl"></div>
    </div>

    <h1 class="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 drop-shadow-sm">
      Inovasi Pelayanan Publik
    </h1>
    <p class="text-blue-600 mt-1 italic text-sm">*sampai saat ini</p>

    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
      <!-- Instansi -->
      <div class="group relative px-6 py-8 rounded-3xl bg-white/70 backdrop-blur shadow-md hover:shadow-lg transition border border-blue-100">
        <div class="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-sm mb-4">
          <i class="fas fa-building text-3xl"></i>
        </div>
        <h3 class="text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
          320
        </h3>
        <p class="mt-2 text-blue-700 font-medium">Instansi</p>
        <span class="absolute inset-x-10 -bottom-1 h-1 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 opacity-0 group-hover:opacity-100 transition"></span>
      </div>

      <!-- Inovasi -->
      <div class="group relative px-6 py-8 rounded-3xl bg-white/70 backdrop-blur shadow-md hover:shadow-lg transition border border-blue-100">
        <div class="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-600 to-sky-500 text-white shadow-sm mb-4">
          <i class="fas fa-lightbulb text-3xl"></i>
        </div>
        <h3 class="text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-sky-500">
          2928
        </h3>
        <p class="mt-2 text-blue-700 font-medium">Inovasi</p>
        <span class="absolute inset-x-10 -bottom-1 h-1 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 opacity-0 group-hover:opacity-100 transition"></span>
      </div>

      <!-- Replikasi -->
      <div class="group relative px-6 py-8 rounded-3xl bg-white/70 backdrop-blur shadow-md hover:shadow-lg transition border border-blue-100 sm:col-span-2 lg:col-span-1">
        <div class="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-sm mb-4">
          <i class="fas fa-clone text-3xl"></i>
        </div>
        <h3 class="text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
          20940
        </h3>
        <p class="mt-2 text-blue-700 font-medium">Replikasi Inovasi</p>
        <span class="absolute inset-x-10 -bottom-1 h-1 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 opacity-0 group-hover:opacity-100 transition"></span>
      </div>
    </div>

    <div class="flex justify-center mt-10">
      <NuxtLink
        to="/etalase"
        class="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-800 transition border border-amber-300/60"
      >
        Lihat Etalase Inovasi
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// No script needed for this static component
</script>