<template>
  <div class="daftar-bacaan-page">
    <v-card class="pa-6">
      <v-card-title class="text-h4 mb-4">
        <v-icon start>mdi-book-open-page-variant</v-icon>
        Daftar Bacaan
      </v-card-title>

      <v-card-text>
        <v-alert type="info" class="mb-4">
          Halaman untuk mengelola daftar bacaan pembaca sistem inovasi.
        </v-alert>

        <!-- Search and Filter -->
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              label="Cari bacaan..."
              prepend-icon="mdi-magnify"
              clearable
              @input="filterBacaan"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filterStatus"
              :items="statusOptions"
              label="Status"
              @update:modelValue="filterBacaan"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              block
              @click="showAddDialog = true"
            >
              Tambah Bacaan
            </v-btn>
          </v-col>
        </v-row>

        <!-- Data Table -->
        <v-data-table
          :headers="headers"
          :items="filteredBacaan"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon="mdi-eye"
              size="small"
              variant="text"
              @click="viewBacaan(item)"
            />
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              color="primary"
              @click="editBacaan(item)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="deleteBacaan(item)"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="showAddDialog" max-width="600">
      <v-card>
        <v-card-title>
          {{ isEditing ? 'Edit Bacaan' : 'Tambah Bacaan Baru' }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveBacaan">
            <v-text-field
              v-model="bacaanForm.judul"
              label="Judul Bacaan"
              required
            />
            <v-textarea
              v-model="bacaanForm.deskripsi"
              label="Deskripsi"
              rows="3"
            />
            <v-select
              v-model="bacaanForm.kategori"
              :items="kategoriOptions"
              label="Kategori"
            />
            <v-select
              v-model="bacaanForm.status"
              :items="statusOptions"
              label="Status"
            />
            <v-text-field
              v-model="bacaanForm.penulis"
              label="Penulis"
            />
            <v-btn type="submit" color="primary" :loading="saving">
              {{ isEditing ? 'Update' : 'Simpan' }}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive data
const search = ref('')
const filterStatus = ref('')
const loading = ref(false)
const saving = ref(false)
const showAddDialog = ref(false)
const isEditing = ref(false)

// Form data
const bacaanForm = ref({
  id: null,
  judul: '',
  deskripsi: '',
  kategori: '',
  status: 'Aktif',
  penulis: ''
})

// Mock data - replace with API calls
const bacaanList = ref([
  {
    id: 1,
    judul: 'Panduan Inovasi Teknologi',
    deskripsi: 'Panduan lengkap tentang inovasi teknologi di Indonesia',
    kategori: 'Teknologi',
    status: 'Aktif',
    penulis: 'Admin JIPPNAS',
    dibaca: 150,
    created_at: '2024-01-15'
  },
  {
    id: 2,
    judul: 'Strategi Pengembangan Inovasi',
    deskripsi: 'Strategi efektif untuk mengembangkan inovasi di organisasi',
    kategori: 'Strategi',
    status: 'Aktif',
    penulis: 'Tim Inovasi',
    dibaca: 89,
    created_at: '2024-01-10'
  }
])

// Options
const statusOptions = ['Aktif', 'Tidak Aktif', 'Draft']
const kategoriOptions = ['Teknologi', 'Strategi', 'Bisnis', 'Sosial', 'Lingkungan']

// Table headers
const headers = [
  { title: 'Judul', key: 'judul' },
  { title: 'Kategori', key: 'kategori' },
  { title: 'Status', key: 'status' },
  { title: 'Penulis', key: 'penulis' },
  { title: 'Dibaca', key: 'dibaca' },
  { title: 'Aksi', key: 'actions', sortable: false }
]

// Computed
const filteredBacaan = computed(() => {
  let filtered = bacaanList.value

  if (search.value) {
    filtered = filtered.filter(item =>
      item.judul.toLowerCase().includes(search.value.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  if (filterStatus.value) {
    filtered = filtered.filter(item => item.status === filterStatus.value)
  }

  return filtered
})

// Methods
const filterBacaan = () => {
  // Filtering is handled by computed property
}

const viewBacaan = (item) => {
  console.log('View bacaan:', item)
  // Implement view functionality
}

const editBacaan = (item) => {
  isEditing.value = true
  bacaanForm.value = { ...item }
  showAddDialog.value = true
}

const deleteBacaan = (item) => {
  if (confirm(`Hapus bacaan "${item.judul}"?`)) {
    bacaanList.value = bacaanList.value.filter(b => b.id !== item.id)
  }
}

const saveBacaan = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      // Update existing
      const index = bacaanList.value.findIndex(b => b.id === bacaanForm.value.id)
      if (index !== -1) {
        bacaanList.value[index] = { ...bacaanForm.value }
      }
    } else {
      // Add new
      const newBacaan = {
        ...bacaanForm.value,
        id: Date.now(),
        dibaca: 0,
        created_at: new Date().toISOString().split('T')[0]
      }
      bacaanList.value.push(newBacaan)
    }

    // Reset form
    bacaanForm.value = {
      id: null,
      judul: '',
      deskripsi: '',
      kategori: '',
      status: 'Aktif',
      penulis: ''
    }
    showAddDialog.value = false
    isEditing.value = false
  } catch (error) {
    console.error('Error saving bacaan:', error)
  } finally {
    saving.value = false
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Aktif': return 'success'
    case 'Tidak Aktif': return 'error'
    case 'Draft': return 'warning'
    default: return 'grey'
  }
}

// Lifecycle
onMounted(() => {
  // Load data from API if needed
})
</script>

<style scoped>
.daftar-bacaan-page {
  min-height: 100vh;
}
</style>