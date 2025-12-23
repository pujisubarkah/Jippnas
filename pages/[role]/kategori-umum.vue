<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Daftar Kategori</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          Tambah Kategori
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Kategori"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="kategoriData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
          :loading="loading"
        >
          <template v-slot:item.gambar="{ item }">
            <v-img :src="item.gambar" width="50" height="50" contain></v-img>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status ? 'green' : 'red'" dark>{{ item.status ? 'Aktif' : 'Tidak Aktif' }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex align-center" style="gap:8px;">
              <v-btn icon small color="primary" @click="editKategori(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deleteKategori(item)" title="Delete">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah/Edit Kategori -->
    <v-dialog v-model="showModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveKategori" class="space-y-4">
            <v-text-field
              v-model="form.nama"
              label="Nama *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama kategori"
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
              placeholder="Masukkan keterangan kategori"
            ></v-textarea>

            <v-text-field
              v-model="form.tahun"
              label="Tahun"
              variant="outlined"
              placeholder="Masukkan tahun"
            ></v-text-field>

            <v-text-field
              v-model="form.jenis"
              label="Jenis"
              variant="outlined"
              placeholder="Masukkan jenis"
            ></v-text-field>

          <v-radio-group v-model="form.status" inline>
            <v-radio label="Aktif" :value="true"></v-radio>
            <v-radio label="Tidak Aktif" :value="false"></v-radio>
          </v-radio-group>
        </v-form>
      </v-card-text>
      <v-card-actions class="pa-0 mt-6">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="closeModal">Batal</v-btn>
        <v-btn color="primary" @click="saveKategori">
          {{ isEditing ? 'Update' : 'Simpan' }}
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'sidebar'
})

const search = ref('')
const kategoriData = ref([])
const loading = ref(true)
const error = ref(null)

// Modal state
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// Form data
const form = ref({
  nama: '',
  gambar: '',
  keterangan: '',
  tahun: '',
  jenis: '',
  status: true
})

const breadcrumbItems = [
  {
    title: 'Daftar Kategori',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Gambar', key: 'gambar', width: '60px' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Tahun', key: 'tahun', width: '60px' },
  { title: 'Jenis', key: 'jenis', width: '50px' },
  { title: 'Status', key: 'status', width: '80px' },
  { title: 'Action', key: 'action', sortable: false, width: '100px' }
]

// Fetch data from API
const fetchKategoriData = async () => {
  try {
    loading.value = true
    const response = await fetch('/api/kategori_umum').then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      return res.json()
    })
    if (response.success) {
      // Add 'no' field for numbering
      kategoriData.value = response.data.map((item, index) => ({
        ...item,
        no: index + 1
      }))
    } else {
      throw new Error('Failed to fetch data')
    }
  } catch (err) {
    console.error('Error fetching kategori data:', err)
    error.value = 'Failed to load data'
    toast.error('Gagal memuat data kategori')
  } finally {
    loading.value = false
  }
}

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    nama: '',
    gambar: '',
    keterangan: '',
    tahun: '',
    jenis: '',
    status: true
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    nama: '',
    gambar: '',
    keterangan: '',
    tahun: '',
    jenis: '',
    status: true
  }
}

const editKategori = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    nama: item.nama,
    gambar: item.gambar,
    keterangan: item.keterangan,
    tahun: item.tahun,
    jenis: item.jenis,
    status: item.status
  }
  showModal.value = true
}

const deleteKategori = async (item) => {
  if (confirm(`Apakah Anda yakin ingin menghapus kategori "${item.nama}"?`)) {
    try {
      const response = await fetch(`/api/kategori_umum/${item.id}`, {
        method: 'DELETE'
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      })
      if (response.success) {
        await fetchKategoriData() // Refresh data
        toast.success('Kategori berhasil dihapus')
      }
    } catch (err) {
      console.error('Error deleting kategori:', err)
      toast.error('Gagal menghapus kategori')
    }
  }
}

const saveKategori = async () => {
  try {
    if (!form.value.nama.trim()) {
      toast.warning('Nama kategori harus diisi')
      return
    }

    let response
    if (isEditing.value) {
      // Update existing kategori
      response = await fetch(`/api/kategori_umum/${editingId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: form.value.nama.trim(),
          gambar: form.value.gambar.trim(),
          keterangan: form.value.keterangan.trim(),
          tahun: form.value.tahun.trim(),
          jenis: form.value.jenis.trim(),
          status: form.value.status
        })
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      })
    } else {
      // Create new kategori
      response = await fetch('/api/kategori_umum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: form.value.nama.trim(),
          gambar: form.value.gambar.trim(),
          keterangan: form.value.keterangan.trim(),
          tahun: form.value.tahun.trim(),
          jenis: form.value.jenis.trim(),
          status: form.value.status
        })
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      })
    }

    if (response.success) {
      await fetchKategoriData() // Refresh data
      toast.success(`Kategori berhasil ${isEditing.value ? 'diupdate' : 'ditambahkan'}`)
      closeModal()
    } else {
      throw new Error('Failed to save kategori')
    }
  } catch (err) {
    console.error('Error saving kategori:', err)
    toast.error(`Gagal ${isEditing.value ? 'mengupdate' : 'menambahkan'} kategori`)
  }
}

onMounted(fetchKategoriData)
</script>

<style scoped>
/* Add any component-specific styles here */
</style>