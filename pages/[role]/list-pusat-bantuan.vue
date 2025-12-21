<template>
  <div class="list-pusat-bantuan-page">
    <v-card class="pa-6">
      <div class="d-flex justify-space-between align-center mb-4">
        <h2 class="text-h4">Manajemen Pusat Bantuan</h2>
        <v-btn color="primary" @click="showAddDialog = true">
          <v-icon start>mdi-plus</v-icon>
          Tambah Bantuan
        </v-btn>
      </div>

      <v-card-text>
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              label="Cari bantuan..."
              prepend-icon="mdi-magnify"
              clearable
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="filterKategori"
              :items="kategoriOptions"
              label="Filter Kategori"
              clearable
            />
          </v-col>
        </v-row>

        <v-data-table
          :headers="headers"
          :items="filteredBantuan"
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

          <template v-slot:item.kategori="{ item }">
            <v-chip
              :color="getKategoriColor(item.kategori)"
              size="small"
              variant="outlined"
            >
              {{ item.kategori }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon="mdi-eye"
              size="small"
              variant="text"
              @click="viewBantuan(item)"
            />
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="editBantuan(item)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="deleteBantuan(item)"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="showAddDialog" max-width="800">
      <v-card>
        <v-card-title>
          {{ isEditing ? 'Edit Bantuan' : 'Tambah Bantuan Baru' }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveBantuan">
            <v-text-field
              v-model="bantuanForm.pertanyaan"
              label="Pertanyaan"
              required
            />
            <v-textarea
              v-model="bantuanForm.jawaban"
              label="Jawaban"
              required
            />
            <v-select
              v-model="bantuanForm.kategori"
              :items="kategoriOptions"
              label="Kategori"
              required
            />
            <v-text-field
              v-model="bantuanForm.tags"
              label="Tags (pisahkan dengan koma)"
            />
            <v-select
              v-model="bantuanForm.status"
              :items="statusOptions"
              label="Status"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showAddDialog = false">Batal</v-btn>
          <v-btn
            color="primary"
            :loading="saving"
            @click="saveBantuan"
          >
            {{ isEditing ? 'Update' : 'Simpan' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog v-model="showViewDialog" max-width="800">
      <v-card v-if="viewBantuanData">
        <v-card-title>
          <v-icon start>mdi-help-circle</v-icon>
          Detail Bantuan
        </v-card-title>
        <v-card-text>
          <h3 class="text-h6 mb-3">{{ viewBantuanData.pertanyaan }}</h3>
          <div class="mb-3" v-html="viewBantuanData.jawaban"></div>
          <v-divider class="mb-3" />
          <div class="d-flex align-center justify-space-between text-caption">
            <div>
              <strong>Kategori:</strong>
              <v-chip
                :color="getKategoriColor(viewBantuanData.kategori)"
                size="small"
                variant="outlined"
                class="ml-2"
              >
                {{ viewBantuanData.kategori }}
              </v-chip>
            </div>
            <div>
              <strong>Status:</strong>
              <v-chip
                :color="getStatusColor(viewBantuanData.status)"
                size="small"
                class="ml-2"
              >
                {{ viewBantuanData.status }}
              </v-chip>
            </div>
          </div>
          <div class="mt-2 text-caption">
            <strong>Dilihat:</strong> {{ viewBantuanData.dilihat }} kali
          </div>
          <div v-if="viewBantuanData.tags" class="mt-3">
            <strong>Tags:</strong>
            <v-chip
              v-for="tag in viewBantuanData.tags.split(',').map(t => t.trim())"
              :key="tag"
              size="small"
              variant="outlined"
              class="mr-1"
            >
              {{ tag }}
            </v-chip>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showViewDialog = false">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'sidebar'
})

// Reactive data
const search = ref('')
const filterKategori = ref('')
const loading = ref(false)
const showAddDialog = ref(false)
const showViewDialog = ref(false)
const viewBantuanData = ref(null)
const isEditing = ref(false)
const saving = ref(false)

// Form data
const bantuanForm = ref({
  id: null,
  pertanyaan: '',
  jawaban: '',
  kategori: '',
  tags: '',
  status: 'Aktif'
})

// Table headers
const headers = [
  { title: 'No', key: 'no', sortable: false },
  { title: 'Pertanyaan', key: 'pertanyaan' },
  { title: 'Kategori', key: 'kategori' },
  { title: 'Status', key: 'status' },
  { title: 'Dilihat', key: 'dilihat' },
  { title: 'Aksi', key: 'actions', sortable: false }
]

// Options
const kategoriOptions = [
  'Login',
  'Inovasi',
  'Upload',
  'Akun',
  'Berita',
  'FAQ',
  'Teknis'
]

const statusOptions = [
  'Aktif',
  'Tidak Aktif',
  'Draft'
]

// Mock data
const bantuanList = ref([
  {
    no: 1,
    id: 1,
    pertanyaan: 'Bagaimana cara login ke JIPPNAS?',
    jawaban: '<p>Untuk login ke JIPPNAS, ikuti langkah berikut:</p><ol><li>Buka halaman login</li><li>Masukkan email atau username Anda</li><li>Masukkan password</li><li>Klik tombol "Masuk"</li></ol><p>Jika lupa password, klik "Lupa Password" untuk reset.</p>',
    kategori: 'Login',
    tags: 'login, akun, password',
    status: 'Aktif',
    dilihat: 150,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    no: 2,
    id: 2,
    pertanyaan: 'Bagaimana cara mengupload inovasi?',
    jawaban: '<p>Untuk mengupload inovasi:</p><ol><li>Login ke akun Anda</li><li>Klik menu "Upload Inovasi"</li><li>Isi form yang tersedia</li><li>Upload file pendukung</li><li>Klik "Submit"</li></ol>',
    kategori: 'Upload',
    tags: 'upload, inovasi',
    status: 'Aktif',
    dilihat: 89,
    created_at: '2024-01-02',
    updated_at: '2024-01-02'
  },
  {
    no: 3,
    id: 3,
    pertanyaan: 'Apa itu JIPPNAS?',
    jawaban: '<p>JIPPNAS adalah Jaringan Inovasi Pelayanan Publik Nasional yang merupakan platform untuk berbagi inovasi pelayanan publik di Indonesia.</p>',
    kategori: 'FAQ',
    tags: 'jippnas, informasi',
    status: 'Aktif',
    dilihat: 200,
    created_at: '2024-01-03',
    updated_at: '2024-01-03'
  }
])

// Computed
const filteredBantuan = computed(() => {
  let filtered = bantuanList.value

  if (search.value) {
    filtered = filtered.filter(item =>
      item.pertanyaan.toLowerCase().includes(search.value.toLowerCase()) ||
      item.jawaban.toLowerCase().includes(search.value.toLowerCase()) ||
      item.tags.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  if (filterKategori.value) {
    filtered = filtered.filter(item => item.kategori === filterKategori.value)
  }

  return filtered
})

// Methods
const viewBantuan = (item) => {
  viewBantuanData.value = item
  item.dilihat++
  showViewDialog.value = true
}

const editBantuan = (item) => {
  bantuanForm.value = { ...item }
  isEditing.value = true
  showAddDialog.value = true
}

const deleteBantuan = (item) => {
  if (confirm(`Apakah Anda yakin ingin menghapus bantuan: "${item.pertanyaan}"?`)) {
    const index = bantuanList.value.findIndex(b => b.id === item.id)
    if (index !== -1) {
      bantuanList.value.splice(index, 1)
      // Reassign no
      bantuanList.value.forEach((b, i) => b.no = i + 1)
    }
  }
}

const saveBantuan = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      // Update existing
      const index = bantuanList.value.findIndex(b => b.id === bantuanForm.value.id)
      if (index !== -1) {
        bantuanList.value[index] = {
          ...bantuanForm.value,
          updated_at: new Date().toISOString().split('T')[0]
        }
      }
    } else {
      // Add new
      const newBantuan = {
        ...bantuanForm.value,
        id: Date.now(),
        no: bantuanList.value.length + 1,
        dilihat: 0,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      }
      bantuanList.value.push(newBantuan)
    }

    // Reset form
    bantuanForm.value = {
      id: null,
      pertanyaan: '',
      jawaban: '',
      kategori: '',
      tags: '',
      status: 'Aktif'
    }
    showAddDialog.value = false
    isEditing.value = false
  } catch (error) {
    console.error('Error saving bantuan:', error)
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

const getKategoriColor = (kategori) => {
  const colors = {
    'Login': 'primary',
    'Inovasi': 'success',
    'Upload': 'info',
    'Akun': 'warning',
    'Berita': 'secondary',
    'FAQ': 'accent',
    'Teknis': 'error'
  }
  return colors[kategori] || 'grey'
}

// Lifecycle
onMounted(() => {
  // Load data from API if needed
})
</script>

<style scoped>
.list-pusat-bantuan-page {
  min-height: 100vh;
}
</style>