<template>
  <div class="bg-linear-to-br from-blue-50 to-blue-100 min-h-screen">
    <!-- Header Section with Logo -->
    <section class="bg-linear-to-r from-blue-600 to-blue-700 shadow-lg">
      <div class="container mx-auto px-4 py-12">
        <div class="flex flex-col items-center">
          <!-- Logo -->
          <v-img
            v-if="!loading"
            :src="logoUrl"
            :alt="instansiData?.nama"
            max-width="150"
            max-height="150"
            contain
            class="mb-6 bg-white rounded-full p-4 shadow-xl"
          >
            <template v-slot:placeholder>
              <div class="flex items-center justify-center" style="height: 150px;">
                <v-progress-circular indeterminate color="white" size="32"></v-progress-circular>
              </div>
            </template>
          </v-img>
          
          <!-- Loading placeholder -->
          <div v-else class="flex items-center justify-center bg-white rounded-full p-4 shadow-xl" style="height: 150px; width: 150px;">
            <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
          </div>
          
          <!-- Instansi Name -->
          <h2 v-if="instansiData" class="text-3xl font-bold text-white text-center drop-shadow-lg">
            {{ instansiData.nama }}
          </h2>
          <input type="hidden" name="idns" id="idns" :value="instansiId">
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <div v-if="instansiData" class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Inovasi Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-linear-to-r from-blue-400 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div class="relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div class="shrink-0">
                <div class="w-16 h-16 bg-linear-to-brrom-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <i class="fas fa-lightbulb text-3xl text-white"></i>
                </div>
              </div>
              <div class="text-right">
                <h1 class="text-5xl font-extrabold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{{ stats.inovasi }}</h1>
                <p class="text-gray-600 text-sm mt-1 font-semibold">Inovasi</p>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center text-blue-600 text-xs font-medium">
                <i class="fas fa-arrow-up mr-1"></i>
                <span>Aktif</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Replikasi Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-linear-to-r from-cyan-400 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div class="relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div class="shrink-0">
                <div class="w-16 h-16 bg-linear-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <i class="fas fa-eye text-3xl text-white"></i>
                </div>
              </div>
              <div class="text-right">
                <h1 class="text-5xl font-extrabold bg-linear-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent">{{ stats.replikasi }}</h1>
                <p class="text-gray-600 text-sm mt-1 font-semibold">Replikasi</p>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center text-cyan-600 text-xs font-medium">
                <i class="fas fa-chart-line mr-1"></i>
                <span>Dipantau</span>
              </div>
            </div>
          </div>
        </div>

        <!-- UPP Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-linear-to-r from-indigo-400 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div class="relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div class="shrink-0">
                <div class="w-16 h-16 bg-linear-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <i class="fas fa-building text-3xl text-white"></i>
                </div>
              </div>
              <div class="text-right">
                <h1 class="text-5xl font-extrabold bg-linear-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">{{ stats.upp }}</h1>
                <p class="text-gray-600 text-sm mt-1 font-semibold">UPP</p>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center text-indigo-600 text-xs font-medium">
                <i class="fas fa-users mr-1"></i>
                <span>Unit Layanan</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Hub Status Card -->
        <div class="relative group">
          <div :class="instansiData.stshub ? 'bg-linear-to-r from-green-400 to-green-600' : 'bg-linear-to-r from-orange-400 to-orange-600'" class="absolute inset-0 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div class="relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div class="shrink-0">
                <div :class="instansiData.stshub ? 'bg-linear-to-br from-green-400 to-green-600' : 'bg-linear-to-br from-orange-400 to-orange-600'" class="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg">
                  <i 
                    :class="instansiData.stshub ? 'fas fa-check-circle' : 'fas fa-clock'" 
                    class="text-3xl text-white"
                  ></i>
                </div>
              </div>
              <div class="text-right">
                <p 
                  :class="instansiData.stshub ? 'text-green-600' : 'text-orange-600'" 
                  class="font-bold text-lg"
                >
                  {{ instansiData.stshub ? 'Hub Aktif' : 'Belum Hub' }}
                </p>
                <p class="text-gray-600 text-sm mt-1 font-semibold">Status Hub JIPP</p>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div :class="instansiData.stshub ? 'text-green-600' : 'text-orange-600'" class="flex items-center text-xs font-medium">
                <i :class="instansiData.stshub ? 'fas fa-check' : 'fas fa-hourglass-half'" class="mr-1"></i>
                <span>{{ instansiData.stshub ? 'Terverifikasi' : 'Dalam Proses' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content with Sidebar Layout -->
    <div v-if="instansiData" class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar: Filter Section -->
        <aside class="lg:w-80 shrink-0">
          <div class="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
            <div class="flex items-center mb-6">
              <div class="w-1 h-8 bg-linear-to-b from-blue-500 to-blue-700 rounded mr-4"></div>
              <h3 class="text-xl font-bold text-gray-800">Filter Inovasi</h3>
            </div>
            
            <!-- Pemangku Kepentingan -->
            <div class="mb-6">
              <button 
                @click="toggleCollapse('pemangku')" 
                class="w-full flex items-center justify-between bg-linear-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 px-4 py-3 rounded-lg transition-all duration-200 border border-blue-200"
              >
                <span class="font-semibold text-blue-800 text-sm">Pemangku Kepentingan</span>
                <i 
                  class="fas fa-chevron-down transition-transform duration-300 text-blue-600" 
                  :class="{ 'rotate-180': collapsedStates.pemangku }"
                ></i>
              </button>
              <div v-show="collapsedStates.pemangku" class="mt-3 pl-3">
                <div class="space-y-3">
                  <div 
                    v-for="pemangku in pemangkuList" 
                    :key="pemangku.id" 
                    class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-2 border-transparent hover:border-blue-300 transition-all cursor-pointer"
                  >
                    <img 
                      :src="pemangku.logo" 
                      alt="Logo" 
                      class="w-12 h-12 object-contain"
                    >
                    <input 
                      type="checkbox" 
                      :id="'pemangku-' + pemangku.id" 
                      :value="pemangku.value" 
                      v-model="selectedPemangku"
                      class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Unit Pelayanan Publik -->
            <div class="mb-6">
              <button 
                @click="toggleCollapse('upp')" 
                class="w-full flex items-center justify-between bg-linear-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 px-4 py-3 rounded-lg transition-all duration-200 border border-blue-200"
              >
                <span class="font-semibold text-blue-800 text-sm">Unit Pelayanan Publik</span>
                <i 
                  class="fas fa-chevron-down transition-transform duration-300 text-blue-600" 
                  :class="{ 'rotate-180': collapsedStates.upp }"
                ></i>
              </button>
              <div v-show="collapsedStates.upp" class="mt-3 pl-3">
                <input 
                  type="text" 
                  v-model="uppInput"
                  placeholder="Masukkan UPP" 
                  class="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                >
              </div>
            </div>

            <!-- Inovator -->
            <div class="mb-6">
              <button 
                @click="toggleCollapse('inovator')" 
                class="w-full flex items-center justify-between bg-linear-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 px-4 py-3 rounded-lg transition-all duration-200 border border-blue-200"
              >
                <span class="font-semibold text-blue-800 text-sm">Inovator</span>
                <i 
                  class="fas fa-chevron-down transition-transform duration-300 text-blue-600" 
                  :class="{ 'rotate-180': collapsedStates.inovator }"
                ></i>
              </button>
              <div v-show="collapsedStates.inovator" class="mt-3 pl-3">
                <input 
                  type="text" 
                  v-model="inovatorInput"
                  placeholder="Masukkan Nama Inovator" 
                  class="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                >
              </div>
            </div>

            <!-- SDGs -->
            <div class="mb-6">
              <button 
                @click="toggleCollapse('sdgs')" 
                class="w-full flex items-center justify-between bg-linear-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 px-4 py-3 rounded-lg transition-all duration-200 border border-blue-200"
              >
                <span class="font-semibold text-blue-800 text-sm">SDGs</span>
                <i 
                  class="fas fa-chevron-down transition-transform duration-300 text-blue-600" 
                  :class="{ 'rotate-180': collapsedStates.sdgs }"
                ></i>
              </button>
              <div v-show="collapsedStates.sdgs" class="mt-3 pl-3">
                <div class="grid grid-cols-3 gap-2">
                  <div 
                    v-for="sdg in sdgsList" 
                    :key="sdg.id" 
                    class="flex flex-col items-center group"
                  >
                    <div class="relative">
                      <img 
                        :src="sdg.icon" 
                        alt="SDG Icon" 
                        class="w-10 h-10 object-contain mb-1 transition-transform group-hover:scale-110"
                      >
                    </div>
                    <input 
                      type="checkbox" 
                      :id="'sdgs-' + sdg.id" 
                      :value="sdg.id" 
                      v-model="selectedSdgs"
                      class="w-3 h-3 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Search Button -->
            <div class="flex justify-center">
              <button 
                @click="cariData"
                class="w-full px-8 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
              >
                <i class="fas fa-search mr-2"></i>
                Cari Inovasi
              </button>
            </div>
          </div>
        </aside>

        <!-- Main Content: Daftar Inovasi -->
        <main class="flex-1">
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="flex items-center mb-6">
              <div class="w-1 h-8 bg-linear-to-b from-blue-500 to-blue-700 rounded mr-4"></div>
              <h3 class="text-2xl font-bold text-gray-800">Daftar Inovasi</h3>
            </div>

            <div v-if="inovasiList.length === 0" class="text-center py-12">
              <i class="fas fa-search text-gray-400 text-4xl mb-4"></i>
              <p class="text-gray-500 text-lg">Tidak ada inovasi ditemukan</p>
            </div>

            <div v-else class="space-y-4">
              <div 
                v-for="inovasi in paginatedInovasi" 
                :key="inovasi.id"
                class="p-4 bg-red-50 flex flex-col rounded-lg shadow-sm border border-red-200"
              >
                <h4 class="mb-2 text-red-600 font-bold text-lg">{{ inovasi.judul }}</h4>
                <p class="font-bold mb-1">
                  <i class="fas fa-building text-gray-700"></i>
                  <span class="ml-2"></span>{{ inovasi.instansi }}
                </p>
                <p class="font-bold text-capitalize mb-1">
                  <i class="fas fa-certificate text-gray-700"></i>
                  <span class="ml-2"></span>{{ inovasi.penghargaan }}
                </p>
                <p class="font-bold text-capitalize mb-1">
                  <i class="fas fa-hashtag text-gray-700"></i>
                  <span class="ml-2"></span>{{ inovasi.kategori }}
                </p>
                <p class="text-green-600 mb-1">
                  <i class="fas fa-check"></i>
                  <span class="ml-2"></span>{{ inovasi.status }}
                </p>
                <p class="text-gray-500 mb-1">
                  <i class="fas fa-calendar-alt"></i>
                  <span class="ml-2"></span>{{ inovasi.tanggal }}
                </p>
                <p class="font-bold text-capitalize mb-1">
                  <i class="fas fa-hashtag text-gray-700"></i>
                  <span class="ml-2"></span>{{ inovasi.sdgs }}
                </p>
                <p class="font-bold text-capitalize mb-1">
                  <i class="fas fa-hashtag text-gray-700"></i>
                  <span class="ml-2"></span>{{ inovasi.upp }}
                </p>
                <p class="font-bold text-capitalize">
                  <i class="fas fa-hashtag text-gray-700"></i>
                  <span class="ml-2"></span>{{ inovasi.pemangku }}
                </p>
              </div>

              <!-- Load More/Less Buttons -->
              <div class="flex justify-center mt-6 space-x-4">
                <button 
                  @click="loadLessInovasi"
                  :disabled="itemsToShow <= 5"
                  class="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 font-bold rounded-xl hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
                >
                  <i class="fas fa-chevron-up mr-2"></i>
                  Muat Lebih Sedikit
                </button>

                <button 
                  @click="loadMoreInovasi"
                  :disabled="itemsToShow >= inovasiList.length"
                  class="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                >
                  <i class="fas fa-chevron-down mr-2"></i>
                  Muat Lebih Banyak
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const instansiId = route.params.id

const loading = ref(true)
const instansiData = ref(null)

const stats = ref({
  inovasi: 5,
  replikasi: 0,
  upp: 5
})

const collapsedStates = ref({
  pemangku: false,
  upp: false,
  inovator: false,
  sdgs: true
})

const uppInput = ref('')
const inovatorInput = ref('')
const selectedPemangku = ref([])
const selectedSdgs = ref([])

const pemangkuList = ref([
  {
    id: 1,
    logo: 'https://www.menpan.go.id/site/images/logo/Logo_PANRB_Default.png',
    value: 'K3004'
  },
  {
    id: 2,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Seal_of_the_Ministry_of_Internal_Affairs_of_the_Republic_of_Indonesia_%282020_version%29.svg/1200px-Seal_of_the_Ministry_of_Internal_Affairs_of_the_Republic_of_Indonesia_%282020_version%29.svg.png',
    value: 'K1001'
  },
  {
    id: 3,
    logo: 'https://lan.go.id/wp-content/uploads/2020/12/cropped-logo-lan2.png',
    value: 'K4025'
  }
])

const sdgsList = ref([
  { id: 1, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-1.png' },
  { id: 2, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-2.png' },
  { id: 3, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-3.png' },
  { id: 4, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-4.png' },
  { id: 5, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-5.png' },
  { id: 6, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-6.png' },
  { id: 7, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-7.png' },
  { id: 8, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-8.png' },
  { id: 9, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-9.png' },
  { id: 10, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-10.png' },
  { id: 11, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-11.png' },
  { id: 12, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-12.png' },
  { id: 13, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-13.png' },
  { id: 14, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-14.png' },
  { id: 15, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-15.png' },
  { id: 16, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-16.png' },
  { id: 17, icon: 'https://jippnas.menpan.go.id/fronts/assets/images/sdgs/icon-17.png' }
])

const logoBaseUrl = 'https://jippnas.menpan.go.id/assets/img/instansi/'
const logoUrl = computed(() => `${logoBaseUrl}${instansiId}.png`)

const toggleCollapse = (section) => {
  collapsedStates.value[section] = !collapsedStates.value[section]
}

const cariData = () => {
  console.log('Searching with data:', {
    instansiId: instansiId,
    upp: uppInput.value,
    inovator: inovatorInput.value,
    pemangku: selectedPemangku.value,
    sdgs: selectedSdgs.value
  })
}

const loadLessDataInstansi = () => {
  console.log('Loading less data for instansi:', instansiId)
}

const loadMoreDataInstansi = () => {
  console.log('Loading more data for instansi:', instansiId)
}

const inovasiList = ref([
  {
    id: 1,
    judul: 'RSUD RAMAH',
    instansi: 'Pemerintah Kabupaten Temanggung',
    penghargaan: 'INNOVATIVE GOVERNMENT AWARD 2022',
    kategori: 'kesehatan',
    status: 'Berlanjut dengan pengembangan',
    tanggal: 'Terakhir diubah 07/02/2024',
    sdgs: 'Kehidupan Sehat dan Sejahtera',
    upp: 'Dinas Tenaga Kerja, Transmigrasi dan Perindustrian',
    pemangku: 'Kementerian Dalam Negeri'
  }
])

const itemsToShow = ref(5)

const paginatedInovasi = computed(() => {
  return inovasiList.value.slice(0, itemsToShow.value)
})

const loadMoreInovasi = () => {
  itemsToShow.value += 5
}

const loadLessInovasi = () => {
  itemsToShow.value = Math.max(itemsToShow.value - 5, 5)
}

const fetchInstansiDetail = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/instansi')
    
    if (response.success && response.data) {
      const found = response.data.find(item => item.id === instansiId)
      if (found) {
        instansiData.value = found
      } else {
        throw new Error('Instansi tidak ditemukan')
      }
    } else {
      throw new Error('Invalid response format')
    }
  } catch (err) {
    console.error('Error fetching instansi detail:', err)
    // Fallback to dummy data
    instansiData.value = {
      id: instansiId,
      nama: 'Instansi Dummy',
      stshub: true
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchInstansiDetail()
})
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>