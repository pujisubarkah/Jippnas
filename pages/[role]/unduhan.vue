<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Unduhan</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          Tambah Unduhan
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Unduhan"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="unduhanData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
          :loading="loading"
        >
          <template v-slot:item.gambar="{ item }">
            <v-img :src="item.gambar" width="100" height="100" contain></v-img>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'Aktif' ? 'green' : 'red'" dark>{{ item.status }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex justify-center align-center">
              <v-btn icon small color="primary" @click="editItem(item)" title="Edit" class="mr-1">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deleteItem(item)" title="Trash" class="mr-1">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn icon small color="blue" @click="viewItem(item)" title="View">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah/Edit Unduhan -->
    <v-dialog v-model="showModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit Unduhan' : 'Tambah Unduhan Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveUnduhan" class="space-y-4">
            <v-text-field
              v-model="form.judul"
              label="Judul *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan judul unduhan"
            ></v-text-field>

            <v-text-field
              v-model="form.gambar"
              label="Gambar"
              type="url"
              variant="outlined"
              placeholder="Masukkan URL gambar"
            ></v-text-field>

            <v-textarea
              v-model="form.deskripsi"
              label="Deskripsi"
              rows="4"
              variant="outlined"
              placeholder="Masukkan deskripsi unduhan"
            ></v-textarea>

            <v-text-field
              v-model="form.file"
              label="File"
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama file"
            ></v-text-field>

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
          <v-btn color="primary" @click="saveUnduhan">
            {{ isEditing ? 'Update' : 'Simpan' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'sidebar'
})

import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'

// Reactive data
const search = ref('')
const unduhanData = ref([])
const loading = ref(true)
const error = ref(null)
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// Form data
const form = ref({
  judul: '',
  gambar: '',
  deskripsi: '',
  file: '',
  status: 'Aktif'
})

const breadcrumbItems = [
  {
    title: 'Daftar Unduhan',
    disabled: true,
  },
]

const headers = [
  { title: 'No.', key: 'no', width: '50px' },
  { title: 'Judul', key: 'judul' },
  { title: 'Gambar', key: 'gambar', width: '120px' },
  { title: 'Deskripsi', key: 'deskripsi' },
  { title: 'File', key: 'file', width: '100px' },
  { title: 'Status', key: 'status', width: '80px' },
  { title: 'Action', key: 'action', sortable: false, width: '150px' }
]

// Fetch data from API
const fetchUnduhanData = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/unduhan')
    if (response.success) {
      // Add 'no' field for numbering
      unduhanData.value = response.data.map((item, index) => ({
        ...item,
        no: index + 1
      }))
    } else {
      throw new Error('Failed to fetch data')
    }
  } catch (err) {
    console.error('Error fetching unduhan data:', err)
    error.value = 'Failed to load data'
    toast.error('Gagal memuat data unduhan')
  } finally {
    loading.value = false
  }
}

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    judul: '',
    gambar: '',
    deskripsi: '',
    file: '',
    status: 'Aktif'
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    judul: '',
    gambar: '',
    deskripsi: '',
    file: '',
    status: 'Aktif'
  }
}

const editItem = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    judul: item.judul,
    gambar: item.gambar,
    deskripsi: item.deskripsi,
    file: item.file,
    status: item.status
  }
  showModal.value = true
}

const deleteItem = async (item) => {
  if (confirm(`Apakah Anda yakin ingin menghapus "${item.judul}"?`)) {
    try {
      const response = await $fetch(`/api/unduhan/${item.id}`, {
        method: 'DELETE'
      })
      if (response.success) {
        await fetchUnduhanData() // Refresh data
        toast.success('Unduhan berhasil dihapus')
      }
    } catch (err) {
      console.error('Error deleting item:', err)
      toast.error('Gagal menghapus unduhan')
    }
  }
}

const saveUnduhan = async () => {
  try {
    if (!form.value.judul.trim()) {
      toast.warning('Judul unduhan harus diisi')
      return
    }

    let response
    if (isEditing.value) {
      // Update existing unduhan
      response = await $fetch(`/api/unduhan/${editingId.value}`, {
        method: 'PUT',
        body: {
          judul: form.value.judul.trim(),
          gambar: form.value.gambar.trim(),
          deskripsi: form.value.deskripsi.trim(),
          file: form.value.file.trim(),
          status: form.value.status
        }
      })
    } else {
      // Create new unduhan
      response = await $fetch('/api/unduhan', {
        method: 'POST',
        body: {
          judul: form.value.judul.trim(),
          gambar: form.value.gambar.trim(),
          deskripsi: form.value.deskripsi.trim(),
          file: form.value.file.trim(),
          status: form.value.status
        }
      })
    }

    if (response.success) {
      await fetchUnduhanData() // Refresh data
      closeModal()
      toast.success(`Unduhan berhasil ${isEditing.value ? 'diupdate' : 'ditambahkan'}`)
    }
  } catch (err) {
    console.error('Error saving unduhan:', err)
    toast.error(`Gagal ${isEditing.value ? 'mengupdate' : 'menyimpan'} unduhan`)
  }
}

const viewItem = (item) => {
  window.open(item.pdf_url, '_blank')
}

// Initialize
onMounted(() => {
  fetchUnduhanData()
})
</script>