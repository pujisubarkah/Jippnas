<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Buku Inovasi</h1>
    <v-card>
      <v-card-header>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          Tambah Buku Inovasi
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="bukuData"
          :items-per-page="10"
          class="elevation-1"
          :loading="loading"
        >
          <template v-slot:item.gambar="{ item }">
            <v-img :src="item.gambar" width="100" height="100" contain></v-img>
          </template>
          <template v-slot:item.sinopsis="{ item }">
            <div>{{ item.sinopsis }}</div>
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex justify-center align-center">
              <v-btn icon small color="primary" @click="editItem(item)" title="Edit" class="mr-1">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deleteItem(item)" title="Trash">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah/Edit Buku Inovasi -->
    <v-dialog v-model="showModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit Buku Inovasi' : 'Tambah Buku Inovasi Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveBuku" class="space-y-4">
            <v-text-field
              v-model="form.judul"
              label="Judul *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan judul buku"
            ></v-text-field>

            <v-text-field
              v-model="form.gambar"
              label="Gambar"
              type="url"
              variant="outlined"
              placeholder="Masukkan URL gambar"
            ></v-text-field>

            <v-textarea
              v-model="form.sinopsis"
              label="Sinopsis"
              rows="4"
              variant="outlined"
              placeholder="Masukkan sinopsis buku"
            ></v-textarea>

            <v-text-field
              v-model="form.file"
              label="File"
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama file"
            ></v-text-field>

            <v-text-field
              v-model="form.uploaded_by"
              label="Uploaded By"
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama uploader"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal">Batal</v-btn>
          <v-btn color="primary" @click="saveBuku">
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
const bukuData = ref([])
const loading = ref(true)
const error = ref(null)
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// Form data
const form = ref({
  judul: '',
  gambar: '',
  sinopsis: '',
  file: '',
  uploaded_by: ''
})

// Headers for data table
const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Judul', key: 'judul' },
  { title: 'Gambar', key: 'gambar', width: '120px' },
  { title: 'Sinopsis', key: 'sinopsis' },
  { title: 'File', key: 'file', width: '100px' },
  { title: 'Uploaded By', key: 'uploaded_by' },
  { title: 'Action', key: 'action', sortable: false, width: '100px' }
]

// Fetch data from API
const fetchBukuData = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/buku-inovasi')
    if (response.success) {
      // Add 'no' field for numbering
      bukuData.value = response.data.map((item, index) => ({
        ...item,
        no: index + 1
      }))
    } else {
      throw new Error('Failed to fetch data')
    }
  } catch (err) {
    console.error('Error fetching buku data:', err)
    error.value = 'Failed to load data'
    toast.error('Gagal memuat data buku inovasi')
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
    sinopsis: '',
    file: '',
    uploaded_by: ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    judul: '',
    gambar: '',
    sinopsis: '',
    file: '',
    uploaded_by: ''
  }
}

const editItem = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    judul: item.judul,
    gambar: item.gambar,
    sinopsis: item.sinopsis,
    file: item.file,
    uploaded_by: item.uploaded_by
  }
  showModal.value = true
}

const deleteItem = async (item) => {
  if (confirm(`Apakah Anda yakin ingin menghapus "${item.judul}"?`)) {
    try {
      const response = await $fetch(`/api/buku-inovasi/${item.id}`, {
        method: 'DELETE'
      })
      if (response.success) {
        await fetchBukuData() // Refresh data
        toast.success('Buku inovasi berhasil dihapus')
      }
    } catch (err) {
      console.error('Error deleting item:', err)
      toast.error('Gagal menghapus buku inovasi')
    }
  }
}

const saveBuku = async () => {
  try {
    if (!form.value.judul.trim()) {
      toast.warning('Judul buku harus diisi')
      return
    }

    let response
    if (isEditing.value) {
      // Update existing buku
      response = await $fetch(`/api/buku-inovasi/${editingId.value}`, {
        method: 'PUT',
        body: {
          judul: form.value.judul.trim(),
          gambar: form.value.gambar.trim(),
          sinopsis: form.value.sinopsis.trim(),
          file: form.value.file.trim(),
          uploaded_by: form.value.uploaded_by.trim()
        }
      })
    } else {
      // Create new buku
      response = await $fetch('/api/buku-inovasi', {
        method: 'POST',
        body: {
          judul: form.value.judul.trim(),
          gambar: form.value.gambar.trim(),
          sinopsis: form.value.sinopsis.trim(),
          file: form.value.file.trim(),
          uploaded_by: form.value.uploaded_by.trim()
        }
      })
    }

    if (response.success) {
      await fetchBukuData() // Refresh data
      closeModal()
      toast.success(`Buku inovasi berhasil ${isEditing.value ? 'diupdate' : 'ditambahkan'}`)
    }
  } catch (err) {
    console.error('Error saving buku:', err)
    toast.error(`Gagal ${isEditing.value ? 'mengupdate' : 'menyimpan'} buku inovasi`)
  }
}

// Initialize
onMounted(() => {
  fetchBukuData()
})
</script>