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
              v-model="form.id"
              label="ID Wilayah *"
              required
              maxlength="10"
              variant="outlined"
              placeholder="Masukkan ID wilayah"
              :disabled="isEditing"
            ></v-text-field>

            <v-text-field
              v-model="form.nama"
              label="Nama Wilayah *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama wilayah"
            ></v-text-field>

            <v-text-field
              v-model="form.jenis"
              label="Jenis"
              maxlength="50"
              variant="outlined"
              placeholder="Masukkan jenis wilayah"
            ></v-text-field>

            <v-text-field
              v-model="form.ibukota"
              label="Ibukota"
              maxlength="100"
              variant="outlined"
              placeholder="Masukkan ibukota wilayah"
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
import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'sidebar'
})

const search = ref('')
const rawWilayahData = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const showLogModal = ref(false)
const selectedWilayahName = ref('')
const logData = ref([])

// Form data
const form = ref({
  id: '',
  nama: '',
  jenis: '',
  ibukota: ''
})

const breadcrumbItems = [
  {
    title: 'Daftar Wilayah',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Jenis', key: 'jenis', width: '80px' },
  { title: 'Ibukota', key: 'ibukota', width: '100px' },
  { title: 'Action', key: 'action', sortable: false, width: '100px' }
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
  editingId.value = null
  form.value = {
    id: '',
    nama: '',
    jenis: '',
    ibukota: ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    id: '',
    nama: '',
    jenis: '',
    ibukota: ''
  }
}

const editWilayah = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    id: item.id,
    nama: item.nama,
    jenis: item.jenis,
    ibukota: item.ibukota
  }
  showModal.value = true
}

const saveWilayah = async () => {
  try {
    if (!form.value.id.trim() || !form.value.nama.trim()) {
      toast.warning('ID dan Nama wilayah harus diisi')
      return
    }

    let response
    if (isEditing.value) {
      // Update existing wilayah
      response = await $fetch(`/api/wilayah/${editingId.value}`, {
        method: 'PUT',
        body: {
          nama: form.value.nama.trim(),
          jenis: form.value.jenis.trim(),
          ibukota: form.value.ibukota.trim()
        }
      })
    } else {
      // Create new wilayah
      response = await $fetch('/api/wilayah', {
        method: 'POST',
        body: {
          id: form.value.id.trim(),
          nama: form.value.nama.trim(),
          jenis: form.value.jenis.trim(),
          ibukota: form.value.ibukota.trim()
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

const logWilayah = (item) => {
  selectedWilayahName.value = item.nama
  // Dummy log data - replace with actual API call
  logData.value = [
    { no: 1, nama: 'Update Nama', updated_by: 'Admin', tanggal: '2023-10-01' },
    { no: 2, nama: 'Update Jenis', updated_by: 'User1', tanggal: '2023-10-02' },
    { no: 3, nama: 'Update Ibukota', updated_by: 'Admin', tanggal: '2023-10-03' }
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