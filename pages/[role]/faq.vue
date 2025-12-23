<script setup>
definePageMeta({
  layout: 'sidebar'
})

import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'

// Reactive data
const search = ref('')
const faqData = ref([])
const loading = ref(true)
const error = ref(null)

// Modal state
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// Form data
const form = ref({
  pertanyaan: '',
  jawaban: '',
  status: true
})

const breadcrumbItems = [
  {
    title: 'Daftar FAQ',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Pertanyaan', key: 'pertanyaan' },
  { title: 'Jawaban', key: 'jawaban' },
  { title: 'Status', key: 'status', width: '100px' },
  { title: 'Action', key: 'actions', sortable: false, width: '150px' }
]

// Fetch data from API
const fetchFaqData = async () => {
  try {
    loading.value = true
    console.log('Fetching FAQ data...')
    const response = await fetch('/api/faq').then(res => {
      console.log('Fetch response status:', res.status)
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      return res.json()
    })
    console.log('Fetch response data:', response)
    if (response.success) {
      // Add 'no' field for numbering and convert boolean status to string
      faqData.value = response.data.map((item, index) => ({
        ...item,
        no: index + 1,
        status: item.status ? 'Aktif' : 'Tidak Aktif'
      }))
      console.log('FAQ data loaded:', faqData.value)
    } else {
      throw new Error('Failed to fetch data')
    }
  } catch (err) {
    console.error('Error fetching faq data:', err)
    error.value = 'Failed to load data'
    toast.error('Gagal memuat data FAQ')
  } finally {
    loading.value = false
  }
}

// CRUD operations
const editItem = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    pertanyaan: item.pertanyaan,
    jawaban: item.jawaban,
    status: item.status === 'Aktif' // Convert string to boolean
  }
  showModal.value = true
}

const deleteItem = async (item) => {
  console.log('Deleting FAQ with id:', item.id)
  if (confirm(`Apakah Anda yakin ingin menghapus FAQ "${item.pertanyaan}"?`)) {
    try {
      console.log('Sending DELETE request...')
      const response = await fetch(`/api/faq/${item.id}`, {
        method: 'DELETE'
      }).then(res => {
        console.log('Delete response status:', res.status)
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      })
      console.log('Delete response:', response)
      if (response.success) {
        await fetchFaqData() // Refresh data
        console.log('Data after delete:', faqData.value)
        toast.success('FAQ berhasil dihapus')
      } else {
        console.warn('Delete response not success:', response)
      }
    } catch (err) {
      console.error('Error deleting item:', err)
      toast.error('Gagal menghapus FAQ')
    }
  }
}

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    pertanyaan: '',
    jawaban: '',
    status: true
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    pertanyaan: '',
    jawaban: '',
    status: true
  }
}

const saveFaq = async () => {
  try {
    if (!form.value.pertanyaan.trim() || !form.value.jawaban.trim()) {
      toast.warning('Pertanyaan dan jawaban harus diisi')
      return
    }

    let response
    if (isEditing.value) {
      // Update existing FAQ
      console.log('Sending PUT request for id:', editingId.value)
      response = await fetch(`/api/faq/${editingId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pertanyaan: form.value.pertanyaan.trim(),
          jawaban: form.value.jawaban.trim(),
          status: form.value.status
        })
      }).then(res => {
        console.log('PUT response status:', res.status)
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      })
    } else {
      // Create new FAQ
      console.log('Sending POST request')
      response = await fetch('/api/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pertanyaan: form.value.pertanyaan.trim(),
          jawaban: form.value.jawaban.trim(),
          status: form.value.status
        })
      }).then(res => {
        console.log('POST response status:', res.status)
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      })
    }
    console.log('Save response:', response)
    if (response.success) {
      await fetchFaqData() // Refresh data
      closeModal()
      toast.success(`FAQ berhasil ${isEditing.value ? 'diupdate' : 'ditambahkan'}`)
    } else {
      console.warn('Save response not success:', response)
    }
  } catch (err) {
    console.error('Error saving FAQ:', err)
    toast.error(`Gagal ${isEditing.value ? 'mengupdate' : 'menyimpan'} FAQ`)
  }
}

// Initialize
onMounted(() => {
  fetchFaqData()
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen FAQ</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          Tambah FAQ
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari FAQ"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="faqData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
          :loading="loading"
        >
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'Aktif' ? 'green' : 'red'" dark>
              {{ item.status }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
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

    <!-- Modal Tambah/Edit FAQ -->
    <v-dialog v-model="showModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit FAQ' : 'Tambah FAQ Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveFaq" class="space-y-4">
            <v-textarea
              v-model="form.pertanyaan"
              label="Pertanyaan *"
              required
              rows="3"
              variant="outlined"
              placeholder="Masukkan pertanyaan FAQ"
            ></v-textarea>

            <v-textarea
              v-model="form.jawaban"
              label="Jawaban *"
              required
              rows="6"
              variant="outlined"
              placeholder="Masukkan jawaban FAQ"
            ></v-textarea>

            <v-radio-group v-model="form.status" inline>
              <v-radio label="Aktif" :value="true"></v-radio>
              <v-radio label="Tidak Aktif" :value="false"></v-radio>
            </v-radio-group>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal">Batal</v-btn>
          <v-btn color="primary" @click="saveFaq">
            {{ isEditing ? 'Update' : 'Simpan' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

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