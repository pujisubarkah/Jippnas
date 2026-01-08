<template>
  <div>
    <div class="d-flex align-center mb-6">
      <v-btn icon size="small" @click="$router.back()" class="mr-3">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1 class="text-2xl font-bold">Detail Inovasi - {{ innovation?.judul || 'Loading...' }}</h1>
    </div>

    <v-card v-if="loading" class="mb-6">
      <v-card-text class="text-center py-8">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-grey">Memuat data inovasi...</p>
      </v-card-text>
    </v-card>

    <div v-else-if="innovation">
      <v-card class="mb-6">
        <v-card-title>Informasi Inovasi</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="No Registrasi" :model-value="innovation.noRegistrasi" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Judul Inovasi" :model-value="innovation.judul" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Jenis Inovasi" :model-value="innovation.jenis" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Institusi" :model-value="innovation.institusi" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="UPP" :model-value="innovation.upp" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Wilayah" :model-value="innovation.wilayah" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="SDGs" :model-value="innovation.sdgs" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Penghargaan" :model-value="innovation.penghargaan" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Tahun Implementasi" :model-value="innovation.tahunImplementasi" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Nama Inovator" :model-value="innovation.namaInnovator" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Nama Pemangku" :model-value="innovation.namaPemangku" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Video" :model-value="innovation.video" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Jumlah Replikasi" :model-value="innovation.jumlahReplikasi" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Alasan Keberlanjutan" :model-value="innovation.alasanKeberlanjutan" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Keberlanjutan" :model-value="innovation.keberlanjutan" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Status" :model-value="innovation.status" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Last Update" :model-value="innovation.lastUpdate" readonly></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <v-card v-else>
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="grey">mdi-alert-circle-outline</v-icon>
        <p class="mt-4 text-grey">Inovasi tidak ditemukan</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: 'sidebar'
})

const route = useRoute()
const innovationId = route.query.id

// State
const innovation = ref(null)
const loading = ref(true)

// Fetch innovation detail
const fetchInnovation = async () => {
  if (!innovationId) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    // TODO: Replace with actual API call
    // const response = await $fetch(`/api/master-inovasi/${innovationId}`)
    // if (response.success) {
    //   innovation.value = response.data
    // }

    // For now, simulate with sample data
    innovation.value = {
      id: innovationId,
      no: 1,
      tahun: '2023',
      noRegistrasi: '609805',
      judul: 'Tes ITSA LAGI',
      jenis: 'Digital',
      institusi: 'PT PLN (Persero)',
      upp: 'Unit TI',
      wilayah: 'Jakarta',
      sdgs: 'SDG 9',
      penghargaan: 'Tidak Ada',
      tahunImplementasi: '2023',
      namaInnovator: 'John Doe',
      namaPemangku: 'Jane Smith',
      video: 'https://example.com/video',
      jumlahReplikasi: 5,
      alasanKeberlanjutan: 'Efisien',
      keberlanjutan: 'Ya',
      status: 'Belum Lengkap',
      lastUpdate: '2023-12-01'
    }
  } catch (error) {
    console.error('Error fetching innovation:', error)
    innovation.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchInnovation()
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.bg-primary {
  background-color: #1976D2 !important;
}

.text-white {
  color: white !important;
}

.text-primary {
  color: #1976D2 !important;
}
</style>
