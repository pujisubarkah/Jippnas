<template>
  <div class="p-6">
    <div>
      <div class="grid grid-cols-1 gap-3">
        <div
          v-for="sdg in sdgsData"
          :key="sdg.id"
          class="bg-linear-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105"
        >
          <div class="flex items-center gap-4">
            <div class="relative">
              <img :src="`/sdgs/${sdg.id}.png`" :alt="`SDG ${sdg.id}`" class="w-12 h-12 rounded-lg shadow-md border-2 border-white" />
              <div class="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                {{ sdg.id }}
              </div>
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-blue-800 text-sm">{{ sdg.title }}</h4>
              <p class="text-blue-600 font-bold">{{ sdg.count }} produk</p>
            </div>
            <div class="text-right">
              <div class="w-16 bg-blue-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full transition-all duration-500" :style="{ width: sdg.width }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>


const sdgsData = [
  { id: 16, title: 'Perdamaian, Keadilan, dan Kelembagaan yang Tangguh...', count: 125, width: '100%' },
  { id: 9, title: 'Industri, Inovasi, dan Infrastruktur...', count: 50, width: '40%' },
  { id: 8, title: 'Pekerjaan Layak dan Pertumbuhan Ekonomi...', count: 49, width: '39.2%' },
  { id: 4, title: 'Pendidikan Berkualitas...', count: 45, width: '36%' },
  { id: 2, title: 'Tanpa Kelaparan...', count: 37, width: '29.6%' },
  { id: 3, title: 'Kehidupan Sehat dan Sejahtera...', count: 34, width: '27.2%' },
  { id: 17, title: 'Kemitraan untuk Mencapai Tujuan...', count: 27, width: '21.6%' },
  { id: 1, title: 'Tanpa Kemiskinan...', count: 16, width: '12.8%' },
  { id: 11, title: 'Kota dan Pemukiman yang Berkelanjutan...', count: 14, width: '11.2%' },
  { id: 12, title: 'Konsumsi dan Produksi yang Bertanggung Jawab...', count: 6, width: '4.8%' },
  { id: 13, title: 'Penanganan Perubahan Iklim...', count: 6, width: '4.8%' },
  { id: 5, title: 'Kesetaraan Gender...', count: 5, width: '4%' },
  { id: 6, title: 'Air Bersih dan Sanitasi Layak...', count: 5, width: '4%' },
  { id: 10, title: 'Berkurangnya Kesenjangan...', count: 4, width: '3.2%' },
  { id: 14, title: 'Ekosistem Lautan...', count: 4, width: '3.2%' },
  { id: 7, title: 'Energi Bersih dan Terjangkau...', count: 3, width: '2.4%' },
  { id: 15, title: 'Ekosistem Daratan...', count: 3, width: '2.4%' }
]
</script>

<style scoped>
/* Additional styles if needed */
</style>
