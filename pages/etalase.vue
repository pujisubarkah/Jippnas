<template>
  <div class="bg-white">
    <InovasiUnggulan />
    <Sdgs />
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-6">Etalase Inovasi</h1>
        <p class="text-lg text-gray-600 mb-4">
          Selamat datang di Etalase Inovasi JIPPNAS. Di sini Anda dapat menjelajahi berbagai inovasi yang telah dikembangkan oleh para inovator di Indonesia.
        </p>
        
        <!-- Tambahkan Daftar Instansi -->
        <div class="mb-8">
          <DaftarInstansi />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Placeholder cards for innovations -->
          <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Inovasi 1</h3>
            <p class="text-gray-600">Deskripsi singkat tentang inovasi ini.</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Inovasi 2</h3>
            <p class="text-gray-600">Deskripsi singkat tentang inovasi ini.</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Inovasi 3</h3>
            <p class="text-gray-600">Deskripsi singkat tentang inovasi ini.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import InovasiUnggulan from '~/components/InovasiUnggulan.vue';
import Sdgs from '~/components/Sdgs.client';
import DaftarInstansi from '~/components/daftar_instansi.vue';

useHead({
  title: 'Etalase Inovasi | JIPPNAS - Jaringan Inovasi Pelayanan Publik Nasional',
  meta: [
    {
      name: 'description',
      content: 'Jelajahi berbagai inovasi pelayanan publik yang telah dikembangkan oleh instansi pemerintah di seluruh Indonesia melalui JIPPNAS.'
    }
  ]
})
</script>