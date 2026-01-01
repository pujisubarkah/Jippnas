<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Instansi</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          Tambah Instansi
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Instansi"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="instansiData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.stshub="{ item }">
            <v-chip :color="item.stshub ? 'green' : 'red'" dark>{{ item.stshub ? 'Memiliki Hub' : 'Belum Memiliki Hub' }}</v-chip>
          </template>
          <template v-slot:item.is_active="{ item }">
            <v-chip :color="item.is_active ? 'green' : 'red'" dark>{{ item.is_active ? 'Aktif' : 'Tidak Aktif' }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex">
              <v-btn icon small color="blue" @click="detailInstansi(item)" title="Detail">
                <v-icon>mdi-information</v-icon>
              </v-btn>
              <v-btn icon small color="primary" @click="editInstansi(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deactivateInstansi(item)" title="Deactivate">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn icon small color="green" @click="statusHubInstansi(item)" title="Status Hub">
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah/Edit Instansi -->
    <v-dialog v-model="showModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit Instansi' : 'Tambah Instansi Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveInstansi" class="space-y-4">
            <v-text-field
              v-model="form.id"
              label="ID Instansi *"
              required
              variant="outlined"
              placeholder="Masukkan ID instansi"
              :disabled="isEditing"
            ></v-text-field>

            <v-text-field
              v-model="form.id_wilayah"
              label="ID Wilayah"
              variant="outlined"
              placeholder="Masukkan ID wilayah"
            ></v-text-field>

            <v-text-field
              v-model="form.nama"
              label="Nama Instansi *"
              required
              variant="outlined"
              placeholder="Masukkan nama instansi"
            ></v-text-field>

            <v-text-field
              v-model="form.singkatan"
              label="Singkatan"
              variant="outlined"
              placeholder="Masukkan singkatan instansi"
            ></v-text-field>

            <v-text-field
              v-model="form.jenis"
              label="Jenis"
              variant="outlined"
              placeholder="Masukkan jenis instansi"
            ></v-text-field>

            <v-text-field
              v-model="form.koordinator"
              label="Koordinator"
              variant="outlined"
              placeholder="Masukkan koordinator"
            ></v-text-field>

            <v-textarea
              v-model="form.alamat"
              label="Alamat"
              rows="3"
              variant="outlined"
              placeholder="Masukkan alamat instansi"
            ></v-textarea>

            <v-text-field
              v-model="form.telepon"
              label="Telepon"
              variant="outlined"
              placeholder="Masukkan nomor telepon"
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

            <v-select
              v-model="form.stshub"
              :items="[
                { title: 'Belum Memiliki Hub', value: false },
                { title: 'Memiliki Hub', value: true }
              ]"
              label="Status Hub"
              variant="outlined"
              item-title="title"
              item-value="value"
            ></v-select>

            <v-select
              v-model="form.is_active"
              :items="[
                { title: 'Tidak Aktif', value: false },
                { title: 'Aktif', value: true }
              ]"
              label="Status Aktif"
              variant="outlined"
              item-title="title"
              item-value="value"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal">Batal</v-btn>
          <v-btn color="primary" @click="saveInstansi">
            {{ isEditing ? 'Update' : 'Simpan' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Detail Instansi -->
    <v-dialog v-model="showDetailModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          Detail Instansi: {{ selectedInstansiName }}
        </v-card-title>
        <v-card-text class="pa-0">
          <div v-if="selectedLogo" class="mb-4">
            <img :src="selectedLogo" alt="Logo Instansi" style="max-width: 100%; max-height: 200px;" />
          </div>
          <div v-else class="mb-4">
            <p>Logo tidak tersedia</p>
          </div>
          <div v-if="selectedLat && selectedLng" class="mb-4">
            <h6>Lokasi:</h6>
            <div id="detailMap" style="height: 300px;"></div>
          </div>
          <div v-else>
            <p>Koordinat tidak tersedia</p>
          </div>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeDetailModal">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Log Instansi -->
    <v-dialog v-model="showLogModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          Log Aktivitas Instansi: {{ selectedInstansiName }}
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
const rawInstansiData = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const showDetailModal = ref(false)
const selectedLogo = ref('')
const selectedLat = ref(null)
const selectedLng = ref(null)
const detailMapInstance = ref(null)
const showLogModal = ref(false)
const selectedInstansiName = ref('')
const logData = ref([])

// Form data
const form = ref({
  id: '',
  id_wilayah: '',
  nama: '',
  singkatan: '',
  jenis: '',
  koordinator: '',
  alamat: '',
  telepon: '',
  lat: null,
  lng: null,
  stshub: false,
  is_active: true
})

const breadcrumbItems = [
  {
    title: 'Daftar Instansi',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Singkatan', key: 'singkatan', width: '100px' },
  { title: 'Jenis', key: 'jenis', width: '80px' },
  { title: 'Alamat', key: 'alamat' },
  { title: 'Telepon', key: 'telepon', width: '80px' },
  { title: 'Status Hub', key: 'stshub', width: '100px' },
  { title: 'Status Aktif', key: 'is_active', width: '100px' },
  { title: 'Action', key: 'action', sortable: false, width: '200px' }
]

const logHeaders = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Updated By', key: 'updated_by' },
  { title: 'Tanggal', key: 'tanggal' }
]

const instansiData = computed(() => {
  return rawInstansiData.value.map((item, index) => ({
    ...item,
    no: index + 1
  }))
})

const fetchInstansi = async () => {
  try {
    const response = await $fetch('/api/instansi')
    if (response.success) {
      rawInstansiData.value = response.data
    } else {
      console.error('Failed to fetch instansi:', response.error)
      toast.error('Gagal memuat data instansi')
    }
  } catch (error) {
    console.error('Error fetching instansi:', error)
    toast.error('Gagal memuat data instansi')
  }
}

onMounted(() => {
  fetchInstansi()
})

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    id: '',
    id_wilayah: '',
    nama: '',
    singkatan: '',
    jenis: '',
    koordinator: '',
    alamat: '',
    telepon: '',
    lat: null,
    lng: null,
    stshub: false,
    is_active: true
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    id: '',
    id_wilayah: '',
    nama: '',
    singkatan: '',
    jenis: '',
    koordinator: '',
    alamat: '',
    telepon: '',
    lat: null,
    lng: null,
    stshub: false,
    is_active: true
  }
}

const editInstansi = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    id: item.id,
    id_wilayah: item.id_wilayah,
    nama: item.nama,
    singkatan: item.singkatan,
    jenis: item.jenis,
    koordinator: item.koordinator,
    alamat: item.alamat,
    telepon: item.telepon,
    lat: item.lat,
    lng: item.lng,
    stshub: item.stshub,
    is_active: item.is_active
  }
  showModal.value = true
}

const saveInstansi = async () => {
  try {
    if (!form.value.id.trim() || !form.value.nama.trim()) {
      toast.warning('ID dan Nama instansi harus diisi')
      return
    }

    let response
    if (isEditing.value) {
      // Update existing instansi
      response = await $fetch(`/api/instansi/${editingId.value}`, {
        method: 'PUT',
        body: {
          id_wilayah: form.value.id_wilayah.trim(),
          nama: form.value.nama.trim(),
          singkatan: form.value.singkatan.trim(),
          jenis: form.value.jenis.trim(),
          koordinator: form.value.koordinator.trim(),
          alamat: form.value.alamat.trim(),
          telepon: form.value.telepon.trim(),
          lat: form.value.lat,
          lng: form.value.lng,
          stshub: form.value.stshub,
          is_active: form.value.is_active
        }
      })
    } else {
      // Create new instansi
      response = await $fetch('/api/instansi', {
        method: 'POST',
        body: {
          id: form.value.id.trim(),
          id_wilayah: form.value.id_wilayah.trim(),
          nama: form.value.nama.trim(),
          singkatan: form.value.singkatan.trim(),
          jenis: form.value.jenis.trim(),
          koordinator: form.value.koordinator.trim(),
          alamat: form.value.alamat.trim(),
          telepon: form.value.telepon.trim(),
          lat: form.value.lat,
          lng: form.value.lng,
          stshub: form.value.stshub,
          is_active: form.value.is_active
        }
      })
    }

    if (response.success) {
      await fetchInstansi() // Refresh data
      closeModal()
      toast.success(`Instansi berhasil ${isEditing.value ? 'diupdate' : 'ditambahkan'}`)
    }
  } catch (error) {
    console.error('Error saving instansi:', error)
    toast.error(`Gagal ${isEditing.value ? 'mengupdate' : 'menyimpan'} instansi`)
  }
}

const deactivateInstansi = async (item) => {
  if (confirm(`Apakah Anda yakin ingin menonaktifkan "${item.nama}"?`)) {
    try {
      const response = await $fetch(`/api/instansi/${item.id}`, {
        method: 'DELETE'
      })
      if (response.success) {
        await fetchInstansi() // Refresh data
        toast.success('Instansi berhasil dinonaktifkan')
      }
    } catch (error) {
      console.error('Error deactivating instansi:', error)
      toast.error('Gagal menonaktifkan instansi')
    }
  }
}

const detailInstansi = async (item) => {
  selectedInstansiName.value = item.nama
  selectedLogo.value = item.logo ? `data:image/png;base64,${item.logo}` : null
  selectedLat.value = item.lat
  selectedLng.value = item.lng
  showDetailModal.value = true

  await nextTick()

  if (selectedLat.value && selectedLng.value && typeof window !== 'undefined' && window.L) {
    if (detailMapInstance.value) {
      detailMapInstance.value.remove()
    }

    detailMapInstance.value = window.L.map('detailMap').setView([selectedLat.value, selectedLng.value], 13)

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(detailMapInstance.value)

    window.L.marker([selectedLat.value, selectedLng.value]).addTo(detailMapInstance.value)
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedLogo.value = ''
  selectedLat.value = null
  selectedLng.value = null
  if (detailMapInstance.value) {
    detailMapInstance.value.remove()
    detailMapInstance.value = null
  }
}

const logInstansi = (item) => {
  selectedInstansiName.value = item.nama
  // Dummy log data - replace with actual API call
  logData.value = [
    { no: 1, nama: 'Update Nama', updated_by: 'Admin', tanggal: '2023-10-01' },
    { no: 2, nama: 'Update Alamat', updated_by: 'User1', tanggal: '2023-10-02' },
    { no: 3, nama: 'Update Status', updated_by: 'Admin', tanggal: '2023-10-03' }
  ]
  showLogModal.value = true
}

const closeLogModal = () => {
  showLogModal.value = false
  logData.value = []
}

function statusHubInstansi(item) {
  // Implementasi ubah status hub instansi
  alert('Status Hub: ' + item.nama)
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>