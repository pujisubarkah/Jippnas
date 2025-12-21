<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8" id="myList">
      <div class="my-4">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Daftar Model Inovasi</h2>

        <form class="my-4" @submit.prevent>
          <div class="form-group">
            <input
              type="text"
              v-model="searchQuery"
              class="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan Judul Model Inovasi"
              @input="filterModels"
            />
          </div>
        </form>
      </div>

      <div class="row col-xs-6 justify-content-center align-content-center" id="contentModel">
        <div
          v-for="model in displayedModels"
          :key="model.id"
          class="container mb-4"
        >
          <div class="card m-2 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="row d-flex justify-content-center align-content-center">
              <div class="col-xs-12 col-md-4 col-lg-4 my-2">
                <img
                  :src="model.image"
                  alt=""
                  class="img-fluid text-center rounded border w-full h-64 object-cover"
                />
              </div>
              <div class="col-xs-12 col-md-7 col-lg-7 my-2">
                <h2 class="text-center text-blue-600 font-bold text-xl mb-4">{{ model.title }}</h2>
                <hr class="border-blue-600 mb-4" />
                <p class="text-justify text-gray-700 leading-relaxed mb-4">{{ model.description }}</p>
                <div class="row justify-content-center align-content-center">
                  <a
                    :href="model.downloadUrl"
                    class="btn btn-blue text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    target="_blank"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="hasMore" class="text-center mt-8">
        <button
          type="button"
          class="btn btn-outline-danger bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          @click="loadMoreDataModel"
        >
          Muat Lebih Banyak
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const searchQuery = ref('')
const displayedCount = ref(5) // Show 5 initially

const models = ref([
  {
    id: 1,
    title: 'Model Inovasi Pelayanan Publik Bidang Pengendalian Inflasi',
    image: 'storage/images/modelinov//E7yzA2aljYJOSjvs.jpg',
    description: 'Inovasi-inovasi yang diterapkan di berbagai daerah di Indonesia menunjukkan potensi besar dalam pengendalian inflasi dan peningkatan kesejahteraan masyarakat. Inovasi-inovasi tersebut mencakup tiga tahap utama dalam pengendalian inflasi: produksi, yang melibatkan optimalisasi sumber daya dan kapasitas produksi melalui kolaborasi antara petani dan kelompok tani, serta pengendalian hama dan penyediaan benih berkualitas; panen, yang memanfaatkan sistem penyimpanan untuk menunda penjualan hingga harga lebih menguntungkan serta program yang memberikan harga adil bagi petani; dan penjualan, di mana pemanfaatan pasar murah dan penjualan langsung oleh KUD mengurangi peran tengkulak, menjaga harga tetap stabil, serta memastikan kesejahteraan konsumen.',
    downloadUrl: 'storage/pdf/modelinov/10/t4PqCV1o0snyb5ptm3wyIkXLFiBrbFwCpJuSbb85.jpg'
  },
  {
    id: 2,
    title: 'Model Inovasi Pelayanan Publik Bidang Peningkatan Penggunaan Produk Dalam Negeri (P3DN)',
    image: 'storage/images/modelinov//XcDlYiFI6W0vVaRP.jpg',
    description: 'Model inovasi pelayanan publik dalam bidang Peningkatan Penggunaan Produk Dalam Negeri (P3DN) yang ditawarkan adalah Model PDCA (Plan-Do-Check-Act) yang dikombinasikan dengan Blok Kanvas sebagai alat bantu dalam mengidentifikasi hal-hal penting yang perlu dianalisis dan dielaborasi oleh inovator. Model ini dirancang untuk membantu para pelaku usaha dalam mengembangkan inovasi secara berkelanjutan dengan mempertimbangkan faktor eksternal yang berpengaruh terhadap keberhasilan inovasi mereka. Model ini diharapkan dapat mendorong para pelaku usaha dan inovator untuk lebih proaktif dalam mengembangkan dan memperbarui inovasi mereka, sehingga dapat mendukung pencapaian tujuan penguatan P3DN secara lebih efektif dan berkelanjutan.',
    downloadUrl: 'storage/pdf/modelinov/9/hYvz2IVYvcJDOaENUWjh3v7BlObEmKWQelWSjy6U.pdf'
  },
  {
    id: 3,
    title: 'Model Inovasi Pelayanan Publik Bidang Penanganan Stunting',
    image: 'storage/images/modelinov//4cXkNJ2R5mbW9FXA.jpg',
    description: 'Penanganan stunting di Indonesia memerlukan pendekatan yang holistik dan terintegrasi, salah satunya dengan mengembangkan model inovasi pelayanan publik yang mencakup tiga komponen utama: manajemen data, edukasi, dan pendampingan. Ketiga komponen ini saling mendukung dalam menciptakan ekosistem kebijakan yang berkelanjutan dan efektif. Manajemen Data berfungsi sebagai tulang punggung dalam penanganan stunting. Edukasi bertujuan untuk meningkatkan kesadaran masyarakat mengenai pentingnya gizi, pola asuh yang baik, serta sanitasi yang sehat. Pendampingan berperan dalam memastikan bahwa setiap keluarga mendapatkan bimbingan langsung terkait pemberian asupan gizi tambahan dan akses layanan kesehatan.',
    downloadUrl: 'storage/pdf/modelinov/8/cJeA3wUdKxc96K8NIiodnD8DJBqxjIvRQaFqoAis.pdf'
  },
  {
    id: 4,
    title: 'Model Inovasi Pelayanan Publik Bidang Digitalisasi Administrasi Pemerintahan',
    image: 'storage/images/modelinov//QnoEFXt3Ou6ooozA.jpg',
    description: 'Bentuk pembelajaran dari inovasi pelayanan publik terkait bagaimana penyelenggaraan digitalisasi administrasi pemerintahan dapat dilakukan dengan efektif dan efisien tanpa mengenyampingkan aspek inovatifnya. Model ini memberikan perhatian pada langkah-langkah praktis yang dapat dilakukan oleh instansi pemerintah untuk mengembangkan inovasi pelayanan publik berbasis digital.',
    downloadUrl: 'storage/pdf/modelinov//Rj2A7TH7oixPfcAIk1BLQH6cWhuRfXamLMSbvjOP.pdf'
  },
  {
    id: 5,
    title: 'Model Inovasi Pelayanan Publik Bidang Peningkatan Investasi',
    image: 'storage/images/modelinov/5/pCTV5pu4ib9Z706W.jpg',
    description: 'Bentuk pembelajaran dari inovasi pelayanan publik terkait upaya peningkatan investasi melalui penguatan aspek tata kelola (governance). Inovasi pelayanan publik bidang peningkatan investasi dilakukan dalam tataran Perencanaan dan Penganggaran, Bisnis Proses, Sumber Daya Manusia, Teknologi Informasi, dan Pengawasan. Able People dan agile process menjadi pendorong utama tata kelola inovasi dalam sistem sosial sebagai upaya meningkatkan investasi. Penerimaan inovasi dalam sistem sosial memperhatikan atribut relative advantage, compatibility, complexity, triability, dan observability.',
    downloadUrl: 'storage/pdf/modelinov//QMa8L45Vl2VdsoNc9PxMCiWq3NAqauhQO2qyX227.pdf'
  }
])

const filteredModels = computed(() => {
  if (!searchQuery.value) return models.value
  return models.value.filter(model =>
    model.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const displayedModels = computed(() => {
  return filteredModels.value.slice(0, displayedCount.value)
})

const hasMore = computed(() => {
  return displayedCount.value < filteredModels.value.length
})

const filterModels = () => {
  displayedCount.value = 5 // Reset to initial count when searching
}

const loadMoreDataModel = () => {
  displayedCount.value += 5
}
</script>

<style scoped>
.btn-blue {
  background-color: #2563eb;
  color: white;
}

.btn-blue:hover {
  background-color: #1d4ed8;
}
</style>