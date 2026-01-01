<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Kategori OECD</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          Tambah OECD
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Nama OECD"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="oecdData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.gambar="{ item }">
            <v-img :src="item.gambar" width="100" height="100" contain></v-img>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'Aktif' ? 'green' : 'red'" dark>{{ item.status }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex align-center" style="gap:8px;">
              <v-btn icon small color="primary" @click="editItem(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deleteOecd(item)" title="Delete">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah/Edit OECD -->
    <v-dialog v-model="showModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit OECD' : 'Tambah OECD Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveOecd" class="space-y-4">
            <v-text-field
              v-model="form.nama"
              label="Nama *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama OECD"
            ></v-text-field>

            <v-textarea
              v-model="form.keterangan"
              label="Keterangan"
              rows="4"
              variant="outlined"
              placeholder="Masukkan keterangan OECD"
            ></v-textarea>

            <v-file-input
              v-model="selectedFile"
              label="Gambar"
              accept="image/*"
              variant="outlined"
              @change="handleFileChange"
              placeholder="Pilih file gambar"
              show-size
            ></v-file-input>

            <v-select
              v-model="form.status"
              :items="['Aktif', 'Tidak Aktif']"
              label="Status"
              variant="outlined"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal">Batal</v-btn>
          <v-btn color="primary" @click="saveOecd">
            {{ isEditing ? 'Update' : 'Simpan' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'sidebar'
})

const search = ref('')
const oecdData = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const selectedFile = ref(null)

// Form data
const form = ref({
  nama: '',
  keterangan: '',
  gambar: '',
  status: 'Aktif'
})

const breadcrumbItems = [
  {
    title: 'Daftar Kategori OECD',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Gambar', key: 'gambar', width: '120px' },
  { title: 'Status', key: 'status', width: '80px' },
  { title: 'Action', key: 'action', sortable: false, width: '100px' }
]

async function fetchOecdData() {
  try {
    const response = await $fetch('/api/master-oecd')
    if (response.success) {
      oecdData.value = response.data.map((item, index) => ({
        no: index + 1,
        nama: item.nama,
        keterangan: item.keterangan,
        gambar: item.gambar,
        status: item.isActive ? 'Aktif' : 'Tidak Aktif',
        id: item.id
      }))
    }
  } catch (error) {
    console.error('Error fetching OECD data:', error)
  }
}

onMounted(() => {
  fetchOecdData()
})

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  selectedFile.value = null
  form.value = {
    nama: '',
    keterangan: '',
    gambar: '',
    status: 'Aktif'
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedFile.value = null
  form.value = {
    nama: '',
    keterangan: '',
    gambar: '',
    status: 'Aktif'
  }
}

const editItem = (item) => {
  isEditing.value = true
  editingId.value = item.id
  selectedFile.value = null  // Reset file input for edit
  form.value = {
    nama: item.nama,
    keterangan: item.keterangan,
    gambar: item.gambar,  // Keep existing gambar (URL or base64)
    status: item.status
  }
  showModal.value = true
}

const handleFileChange = () => {
  if (selectedFile.value && selectedFile.value.length > 0) {
    const file = selectedFile.value[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.gambar = e.target.result  // Set base64 string
    }
    reader.readAsDataURL(file)
  } else {
    form.value.gambar = ''  // Clear if no file selected
  }
}

async function saveOecd() {
  const payload = {
    nama: form.value.nama,
    keterangan: form.value.keterangan,
    gambar: form.value.gambar,
    isActive: form.value.status === 'Aktif'
  }

  try {
    if (isEditing.value) {
      await $fetch(`/api/master-oecd/${editingId.value}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch('/api/master-oecd', {
        method: 'POST',
        body: payload
      })
    }
    closeModal()
    await fetchOecdData()
  } catch (error) {
    console.error('Error saving OECD:', error)
    alert('Failed to save OECD')
  }
}

async function deleteOecd(item) {
  if (confirm('Yakin hapus OECD ' + item.nama + '?')) {
    try {
      await $fetch(`/api/master-oecd/${item.id}`, { method: 'DELETE' })
      // Refresh data after delete
      await fetchOecdData()
    } catch (error) {
      console.error('Error deleting OECD item:', error)
      alert('Failed to delete item')
    }
  }
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>