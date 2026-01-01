<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Wilayah</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          Tambah Wilayah
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Wilayah"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="wilayahData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.action="{ item }">
            <div class="d-flex">
              <v-btn icon small color="green" @click="viewPath(item)" title="View Path">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn icon small color="blue" @click="logWilayah(item)" title="Log">
                <v-icon>mdi-card-account-details</v-icon>
              </v-btn>
              <v-btn icon small color="primary" @click="editWilayah(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah/Edit Wilayah -->
    <v-dialog v-model="showModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit Wilayah' : 'Tambah Wilayah Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveWilayah" class="space-y-4">
            <v-text-field
              v-model="form.kode"
              label="Kode Wilayah *"
              required
              variant="outlined"
              placeholder="Masukkan kode wilayah"
              :disabled="isEditing"
            ></v-text-field>

            <v-text-field
              v-model="form.nama"
              label="Nama Wilayah *"
              required
              variant="outlined"
              placeholder="Masukkan nama wilayah"
            ></v-text-field>

            <v-text-field
              v-model="form.ibukota"
              label="Ibukota"
              variant="outlined"
              placeholder="Masukkan ibukota wilayah"
            ></v-text-field>

            <v-text-field
              v-model.number="form.lat"
              label="Latitude"
              type="number"
              step="any"
              variant="outlined"
              placeholder="Masukkan latitude"
            ></v-text-field>

            <v-text-field
              v-model.number="form.lng"
              label="Longitude"
              type="number"
              step="any"
              variant="outlined"
              placeholder="Masukkan longitude"
            ></v-text-field>

            <v-text-field
              v-model.number="form.elv"
              label="Elevation"
              type="number"
              step="any"
              variant="outlined"
              placeholder="Masukkan elevation"
            ></v-text-field>

            <v-text-field
              v-model.number="form.tz"
              label="Timezone"
              type="number"
              variant="outlined"
              placeholder="Masukkan timezone"
            ></v-text-field>

            <v-text-field
              v-model.number="form.luas"
              label="Luas"
              type="number"
              step="any"
              variant="outlined"
              placeholder="Masukkan luas"
            ></v-text-field>

            <v-text-field
              v-model.number="form.penduduk"
              label="Penduduk"
              type="number"
              variant="outlined"
              placeholder="Masukkan jumlah penduduk"
            ></v-text-field>

            <v-textarea
              v-model="form.path"
              label="Path"
              variant="outlined"
              placeholder="Masukkan path"
              rows="3"
            ></v-textarea>

            <v-text-field
              v-model.number="form.status"
              label="Status"
              type="number"
              variant="outlined"
              placeholder="Masukkan status (0 atau 1)"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal">Batal</v-btn>
          <v-btn color="primary" @click="saveWilayah">
            {{ isEditing ? 'Update' : 'Simpan' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal View Path -->
    <v-dialog v-model="showPathModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          Peta Wilayah: {{ selectedWilayahName }}
        </v-card-title>
        <v-card-text class="pa-0">
          <div id="map" style="height: 400px;"></div>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closePathModal">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Log Wilayah -->
    <v-dialog v-model="showLogModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          Log Aktivitas Wilayah: {{ selectedWilayahName }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-data-table
            :headers="logHeaders"
            :items="logData"
            :items-per-page="10"
            class="elevation-1"
          ></v-data-table>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeLogModal">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'sidebar'
})

useHead({
  link: [
    { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' }
  ],
  script: [
    { src: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js' }
  ]
})

const search = ref('')
const rawWilayahData = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingKode = ref(null)
const showPathModal = ref(false)
const selectedPath = ref('')
const mapInstance = ref(null)
const showLogModal = ref(false)
const selectedWilayahName = ref('')
const logData = ref([])

// Form data
const form = ref({
  kode: '',
  nama: '',
  ibukota: '',
  lat: null,
  lng: null,
  elv: null,
  tz: 7,
  luas: null,
  penduduk: null,
  path: '',
  status: 1
})

const breadcrumbItems = [
  {
    title: 'Daftar Wilayah',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Kode', key: 'kode', width: '80px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Ibukota', key: 'ibukota', width: '100px' },
  { title: 'Lat', key: 'lat', width: '80px' },
  { title: 'Lng', key: 'lng', width: '80px' },
  { title: 'Status', key: 'status', width: '60px' },
  { title: 'Action', key: 'action', sortable: false, width: '150px' }
]

const logHeaders = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Updated By', key: 'updated_by' },
  { title: 'Tanggal', key: 'tanggal' }
]

const wilayahData = computed(() => {
  return rawWilayahData.value.map((item, index) => ({
    ...item,
    no: index + 1
  }))
})

const fetchWilayah = async () => {
  try {
    const response = await $fetch('/api/wilayah')
    if (response.success) {
      rawWilayahData.value = response.data
    } else {
      console.error('Failed to fetch wilayah:', response.error)
      toast.error('Gagal memuat data wilayah')
    }
  } catch (error) {
    console.error('Error fetching wilayah:', error)
    toast.error('Gagal memuat data wilayah')
  }
}

onMounted(() => {
  fetchWilayah()
})

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingKode.value = null
  form.value = {
    kode: '',
    nama: '',
    ibukota: '',
    lat: null,
    lng: null,
    elv: null,
    tz: 7,
    luas: null,
    penduduk: null,
    path: '',
    status: 1
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    kode: '',
    nama: '',
    ibukota: '',
    lat: null,
    lng: null,
    elv: null,
    tz: 7,
    luas: null,
    penduduk: null,
    path: '',
    status: 1
  }
}

const editWilayah = (item) => {
  isEditing.value = true
  editingKode.value = item.kode
  form.value = {
    kode: item.kode,
    nama: item.nama,
    ibukota: item.ibukota,
    lat: item.lat,
    lng: item.lng,
    elv: item.elv,
    tz: item.tz,
    luas: item.luas,
    penduduk: item.penduduk,
    path: item.path,
    status: item.status
  }
  showModal.value = true
}

const saveWilayah = async () => {
  try {
    if (!form.value.kode.trim() || !form.value.nama.trim()) {
      toast.warning('Kode dan Nama wilayah harus diisi')
      return
    }

    let response
    if (isEditing.value) {
      // Update existing wilayah
      response = await $fetch(`/api/wilayah/${editingKode.value}`, {
        method: 'PUT',
        body: {
          nama: form.value.nama.trim(),
          ibukota: form.value.ibukota.trim(),
          lat: form.value.lat,
          lng: form.value.lng,
          elv: form.value.elv,
          tz: form.value.tz,
          luas: form.value.luas,
          penduduk: form.value.penduduk,
          path: form.value.path.trim(),
          status: form.value.status
        }
      })
    } else {
      // Create new wilayah
      response = await $fetch('/api/wilayah', {
        method: 'POST',
        body: {
          kode: form.value.kode.trim(),
          nama: form.value.nama.trim(),
          ibukota: form.value.ibukota.trim(),
          lat: form.value.lat,
          lng: form.value.lng,
          elv: form.value.elv,
          tz: form.value.tz,
          luas: form.value.luas,
          penduduk: form.value.penduduk,
          path: form.value.path.trim(),
          status: form.value.status
        }
      })
    }

    if (response.success) {
      await fetchWilayah() // Refresh data
      closeModal()
      toast.success(`Wilayah berhasil ${isEditing.value ? 'diupdate' : 'ditambahkan'}`)
    }
  } catch (error) {
    console.error('Error saving wilayah:', error)
    toast.error(`Gagal ${isEditing.value ? 'mengupdate' : 'menyimpan'} wilayah`)
  }
}

const viewPath = async (item) => {
  selectedWilayahName.value = item.nama
  selectedPath.value = item.path
  showPathModal.value = true

  await nextTick()

  if (typeof window !== 'undefined' && window.L) {
    // Destroy previous map if exists
    if (mapInstance.value) {
      mapInstance.value.remove()
    }

    // Initialize map centered on Indonesia
    mapInstance.value = window.L.map('map').setView([-2, 118], 5)

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance.value)

    try {
      const pathData = JSON.parse(selectedPath.value)
      if (Array.isArray(pathData) && pathData.length > 0) {
        const bounds = []
        pathData.forEach(polygonCoords => {
          if (Array.isArray(polygonCoords) && polygonCoords.length > 0) {
            const polygon = window.L.polygon(polygonCoords).addTo(mapInstance.value)
            bounds.push(polygon.getBounds())
          }
        })
        if (bounds.length > 0) {
          const group = new window.L.featureGroup(bounds.map(b => window.L.rectangle(b)))
          mapInstance.value.fitBounds(group.getBounds())
        }
      }
    } catch (error) {
      console.error('Error parsing path:', error)
      toast.error('Gagal memuat peta wilayah')
    }
  } else {
    toast.error('Leaflet tidak tersedia')
  }
}

const closePathModal = () => {
  showPathModal.value = false
  selectedPath.value = ''
  if (mapInstance.value) {
    mapInstance.value.remove()
    mapInstance.value = null
  }
}

const logWilayah = (item) => {
  selectedWilayahName.value = item.nama
  // Dummy log data - replace with actual API call
  logData.value = [
    { no: 1, nama: 'Update Nama', updated_by: 'Admin', tanggal: '2023-10-01' },
    { no: 2, nama: 'Update Ibukota', updated_by: 'User1', tanggal: '2023-10-02' },
    { no: 3, nama: 'Update Status', updated_by: 'Admin', tanggal: '2023-10-03' }
  ]
  showLogModal.value = true
}

const closeLogModal = () => {
  showLogModal.value = false
  logData.value = []
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>