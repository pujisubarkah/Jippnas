<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Acara Events</h1>
    <v-card>
      <v-card-header>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          Tambah Acara/Events
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="acaraData"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.gambar="{ item }">
            <v-img :src="item.gambar || 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png'" width="100" height="100" contain></v-img>
          </template>
          <template v-slot:item.keterangan="{ item }">
            <div v-html="item.keterangan"></div>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.is_active === '1' ? 'green' : 'red'" dark>{{ item.is_active === '1' ? 'Aktif' : 'Tidak Aktif' }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
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

    <!-- Modal Tambah/Edit Acara -->
    <v-dialog v-model="showModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit Acara' : 'Tambah Acara Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveAcara" class="space-y-4">
            <v-text-field
              v-model="form.title"
              label="Judul *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan judul acara"
            ></v-text-field>

            <v-text-field
              v-model="form.tgl_acara"
              label="Tanggal Acara *"
              type="date"
              required
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.jam_acara"
              label="Jam Acara *"
              type="time"
              required
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.start_date"
              label="Tanggal Mulai"
              type="date"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.end_date"
              label="Tanggal Selesai"
              type="date"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.gambar"
              label="Gambar"
              type="url"
              variant="outlined"
              placeholder="Masukkan URL gambar"
            ></v-text-field>

            <v-textarea
              v-model="form.keterangan"
              label="Keterangan"
              rows="4"
              variant="outlined"
              placeholder="Masukkan keterangan acara"
            ></v-textarea>

            <v-text-field
              v-model="form.nm_penyelenggara"
              label="Penyelenggara"
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama penyelenggara"
            ></v-text-field>

            <v-select
              v-model="form.is_active"
              :items="[
                { title: 'Aktif', value: '1' },
                { title: 'Tidak Aktif', value: '0' }
              ]"
              label="Status"
              variant="outlined"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal">Batal</v-btn>
          <v-btn color="primary" @click="saveAcara">
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

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Judul', key: 'title' },
  { title: 'Tanggal Acara', key: 'tgl_acara', width: '100px' },
  { title: 'Jam Acara', key: 'jam_acara', width: '80px' },
  { title: 'Tanggal Mulai', key: 'start_date', width: '100px' },
  { title: 'Tanggal Selesai', key: 'end_date', width: '100px' },
  { title: 'Gambar', key: 'gambar', width: '120px' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Penyelenggara', key: 'nm_penyelenggara' },
  { title: 'Status', key: 'status', width: '80px' },
  { title: 'Action', key: 'action', sortable: false, width: '80px' }
]

const acaraData = ref([])

// Fetch data from API
const fetchAcara = async () => {
  try {
    const response = await $fetch('/api/acara')
    if (response.success) {
      acaraData.value = response.data.map((item, index) => ({
        ...item,
        no: index + 1
      }))
    }
  } catch (error) {
    console.error('Error fetching acara:', error)
    toast.error('Gagal memuat data acara')
  }
}

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// Form data
const form = ref({
  title: '',
  tgl_acara: '',
  jam_acara: '',
  start_date: '',
  end_date: '',
  gambar: '',
  keterangan: '',
  nm_penyelenggara: '',
  is_active: '1'
})

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    title: '',
    tgl_acara: '',
    jam_acara: '',
    start_date: '',
    end_date: '',
    gambar: '',
    keterangan: '',
    nm_penyelenggara: '',
    is_active: '1'
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    title: '',
    tgl_acara: '',
    jam_acara: '',
    start_date: '',
    end_date: '',
    gambar: '',
    keterangan: '',
    nm_penyelenggara: '',
    is_active: '1'
  }
}

const editItem = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    title: item.title || '',
    tgl_acara: item.tgl_acara || '',
    jam_acara: item.jam_acara || '',
    start_date: item.start_date || '',
    end_date: item.end_date || '',
    gambar: item.gambar || '',
    keterangan: item.keterangan || '',
    nm_penyelenggara: item.nm_penyelenggara || '',
    is_active: item.is_active || '1'
  }
  showModal.value = true
}

const deleteItem = async (item) => {
  if (confirm(`Apakah Anda yakin ingin menghapus acara "${item.title}"?`)) {
    try {
      const response = await $fetch(`/api/acara/${item.id}`, {
        method: 'DELETE'
      })
      if (response.success) {
        toast.success('Acara berhasil dihapus')
        await fetchAcara()
      } else {
        toast.error('Gagal menghapus acara')
      }
    } catch (error) {
      console.error('Error deleting acara:', error)
      toast.error('Gagal menghapus acara')
    }
  }
}

const saveAcara = async () => {
  if (!form.value.title.trim() || !form.value.tgl_acara || !form.value.jam_acara) {
    toast.warning('Judul, tanggal acara, dan jam acara harus diisi')
    return
  }

  try {
    const payload = {
      title: form.value.title.trim(),
      tgl_acara: form.value.tgl_acara,
      jam_acara: form.value.jam_acara,
      start_date: form.value.start_date || form.value.tgl_acara,
      end_date: form.value.end_date || form.value.tgl_acara,
      gambar: form.value.gambar.trim(),
      keterangan: form.value.keterangan.trim(),
      nm_penyelenggara: form.value.nm_penyelenggara.trim(),
      is_active: form.value.is_active
    }

    if (isEditing.value) {
      // Update
      const response = await $fetch(`/api/acara/${editingId.value}`, {
        method: 'PUT',
        body: payload
      })
      if (response.success) {
        toast.success('Acara berhasil diupdate')
        await fetchAcara()
        closeModal()
      } else {
        toast.error('Gagal mengupdate acara')
      }
    } else {
      // Add new
      const response = await $fetch('/api/acara', {
        method: 'POST',
        body: payload
      })
      if (response.success) {
        toast.success('Acara berhasil ditambahkan')
        await fetchAcara()
        closeModal()
      } else {
        toast.error('Gagal menambahkan acara')
      }
    }
  } catch (error) {
    console.error('Error saving acara:', error)
    toast.error('Gagal menyimpan acara')
  }
}

// Fetch data on mount
onMounted(() => {
  fetchAcara()
})
</script>