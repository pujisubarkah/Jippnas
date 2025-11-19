<template>
  <div class="pb-5" style="background: linear-gradient(180deg, rgba(255, 244, 242, 0) 0%, #FFF4F2 100%);">
    <div class="text-white ms-4 mb-3 py-2 rounded-lg">
      <nav aria-label="breadcrumb" class="mt-4">
        <ol class="flex space-x-2 p-2">
          <li><a href="/" class="text-red-500 hover:text-red-700 transition">Beranda</a></li>
          <li class="text-white">/</li>
          <li class="text-white font-semibold">Tentang JIPPNAS</li>
        </ol>
      </nav>
    </div>
    <div class="container mx-auto px-4">
      <div class="py-2">
        <div class="text-white rounded-2xl overflow-hidden shadow-2xl">
          <div class="w-full">
            <img class="w-full object-cover" src="https://via.placeholder.com/800x400?text=JIPPNAS+About+Image" style="max-height:400px;" alt="JIPPNAS About">
          </div>
        </div>
      </div>
      <div class="py-8">
        <div class="bg-white rounded-2xl shadow-xl p-8 mx-auto max-w-4xl">
          <h2 class="text-3xl font-bold text-blue-800 mb-6 text-center">Tentang JIPPNAS</h2>
          <div class="flex items-center mb-4">
            <i class="fas fa-lightbulb text-blue-600 text-2xl mr-4"></i>
            <p class="text-gray-700 text-lg leading-relaxed" style="font-family: 'Poppins', sans-serif;">
              JIPPNas hadir sebagai simpul kolaborasi dan pusat pengetahuan inovasi pelayanan publik. Melalui sinergi, pembelajaran, dan penyebaran praktik terbaik, JIPPNas mendorong birokrasi yang adaptif, responsif, dan berdampak nyata bagi masyarakat.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <i class="fas fa-eye text-blue-600 text-3xl mb-4"></i>
              <h3 class="text-xl font-semibold text-blue-800 mb-2">Visi</h3>
              <p class="text-gray-600">Menjadi pusat inovasi terdepan dalam pelayanan publik di Indonesia.</p>
            </div>
            <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <i class="fas fa-target text-blue-600 text-3xl mb-4"></i>
              <h3 class="text-xl font-semibold text-blue-800 mb-2">Misi</h3>
              <p class="text-gray-600">Mendorong inovasi, kolaborasi, dan pembelajaran berkelanjutan di seluruh daerah.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No need to import Navbar anymore
</script>