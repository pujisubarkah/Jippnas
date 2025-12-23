<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Model Inovasi</h1>
    <v-card>
      <v-card-header>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          Tambah Modal Inovasi
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="modelData"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.gambar="{ item }">
            <v-img :src="item.gambar" width="100" height="100" contain></v-img>
          </template>
          <template v-slot:item.keterangan="{ item }">
            <div v-html="item.keterangan"></div>
          </template>
          <template v-slot:item.aksi="{ item }">
            <div class="d-flex">
              <v-btn icon small color="primary" @click="editItem(item)" title="Edit">
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

    <!-- Modal Tambah/Edit Inovasi -->
    <v-dialog v-model="showModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit Inovasi' : 'Tambah Inovasi Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveInovasi" class="space-y-4">
            <v-text-field
              v-model="form.judul"
              label="Judul *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan judul inovasi"
            ></v-text-field>

            <v-text-field
              v-model="form.gambar"
              label="Gambar"
              type="url"
              variant="outlined"
              placeholder="Masukkan URL gambar"
            ></v-text-field>

            <v-text-field
              v-model="form.file"
              label="File"
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama file"
            ></v-text-field>

            <v-textarea
              v-model="form.keterangan"
              label="Keterangan"
              rows="4"
              variant="outlined"
              placeholder="Masukkan keterangan inovasi"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal">Batal</v-btn>
          <v-btn color="primary" @click="saveInovasi">
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
const modelData = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// Form data
const form = ref({
  judul: '',
  gambar: '',
  file: '',
  keterangan: ''
})

const headers = [
  { title: 'ID', key: 'id', width: '50px' },
  { title: 'Judul', key: 'judul' },
  { title: 'Gambar', key: 'gambar', width: '120px' },
  { title: 'File', key: 'file', width: '80px' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Aksi', key: 'aksi', sortable: false, width: '100px' }
]

// Fetch data
const fetchModelData = async () => {
  try {
    const response = await $fetch('/api/master-inovasi')
    modelData.value = response?.data || []
  } catch (error) {
    console.error('Error fetching model data:', error)
    toast.error('Gagal memuat data inovasi')
  }
}

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    judul: '',
    gambar: '',
    file: '',
    keterangan: ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    judul: '',
    gambar: '',
    file: '',
    keterangan: ''
  }
}

const editItem = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    judul: item.judul,
    gambar: item.gambar,
    file: item.file,
    keterangan: item.keterangan
  }
  showModal.value = true
}

const deleteItem = async (item) => {
  if (confirm(`Apakah Anda yakin ingin menghapus inovasi "${item.judul}"?`)) {
    try {
      const response = await $fetch(`/api/master-inovasi/${item.id}`, {
        method: 'DELETE'
      })
      if (response.success) {
        await fetchModelData() // Refresh data
        toast.success('Inovasi berhasil dihapus')
      }
    } catch (err) {
      console.error('Error deleting item:', err)
      toast.error('Gagal menghapus inovasi')
    }
  }
}

const saveInovasi = async () => {
  try {
    if (!form.value.judul.trim()) {
      toast.warning('Judul inovasi harus diisi')
      return
    }

    let response
    if (isEditing.value) {
      // Update existing inovasi
      response = await $fetch(`/api/master-inovasi/${editingId.value}`, {
        method: 'PUT',
        body: {
          judul: form.value.judul.trim(),
          gambar: form.value.gambar.trim(),
          file: form.value.file.trim(),
          keterangan: form.value.keterangan.trim()
        }
      })
    } else {
      // Create new inovasi
      response = await $fetch('/api/master-inovasi', {
        method: 'POST',
        body: {
          judul: form.value.judul.trim(),
          gambar: form.value.gambar.trim(),
          file: form.value.file.trim(),
          keterangan: form.value.keterangan.trim()
        }
      })
    }

    if (response.success) {
      await fetchModelData() // Refresh data
      closeModal()
      toast.success(`Inovasi berhasil ${isEditing.value ? 'diupdate' : 'ditambahkan'}`)
    }
  } catch (err) {
    console.error('Error saving inovasi:', err)
    toast.error(`Gagal ${isEditing.value ? 'mengupdate' : 'menyimpan'} inovasi`)
  }
}

// Initialize
onMounted(() => {
  fetchModelData()
})
</script>

<style scoped>
/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>