<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Kompetisi</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          Tambah Kompetisi
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Kompetisi"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="kompetisiData"
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
            <div class="d-flex align-center" style="gap:8px;">
              <v-btn icon small color="primary" @click="editKompetisi(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deleteKompetisi(item)" title="Delete">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn icon small color="blue" @click="viewKompetisi(item)" title="View">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah/Edit Kompetisi -->
    <v-dialog v-model="showModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit Kompetisi' : 'Tambah Kompetisi Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveKompetisi" class="space-y-4">
            <v-text-field
              v-model="form.nama"
              label="Nama *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama kompetisi"
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
              placeholder="Masukkan keterangan kompetisi"
            ></v-textarea>

            <v-radio-group v-model="form.status" inline>
              <v-radio label="Aktif" value="Aktif"></v-radio>
              <v-radio label="Tidak Aktif" value="Tidak Aktif"></v-radio>
            </v-radio-group>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal">Batal</v-btn>
          <v-btn color="primary" @click="saveKompetisi">
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
const kompetisiData = ref([])
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
  status: 'Tidak Aktif'
})

const breadcrumbItems = [
  {
    title: 'Daftar Kompetisi',
    disabled: true,
  },
]

const headers = [
  { title: 'No.', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Gambar', key: 'gambar', width: '120px' },
  { title: 'Status', key: 'status', width: '80px' },
  { title: 'Action', key: 'action', sortable: false, width: '150px' }
]

// Fetch data from API
const fetchKompetisiData = async () => {
  try {
    loading.value = true
    const response = await fetch('/api/kategori_kompetisi').then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      return res.json()
    })
    if (response.success) {
      // Add 'no' field for numbering
      kompetisiData.value = response.data.map((item, index) => ({
        ...item,
        no: index + 1
      }))
    } else {
      throw new Error('Failed to fetch data')
    }
  } catch (err) {
    console.error('Error fetching kompetisi data:', err)
    error.value = 'Failed to load data'
    toast.error('Gagal memuat data kompetisi')
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
    status: 'Tidak Aktif'
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    nama: '',
    gambar: '',
    keterangan: '',
    status: 'Tidak Aktif'
  }
}

const editKompetisi = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    nama: item.nama,
    gambar: item.gambar,
    keterangan: item.keterangan,
    status: item.status
  }
  showModal.value = true
}

const deleteKompetisi = async (item) => {
  if (confirm(`Apakah Anda yakin ingin menghapus kompetisi "${item.nama}"?`)) {
    try {
      const response = await fetch(`/api/kategori_kompetisi/${item.id}`, {
        method: 'DELETE'
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      })
      if (response.success) {
        await fetchKompetisiData() // Refresh data
        toast.success('Kompetisi berhasil dihapus')
      }
    } catch (err) {
      console.error('Error deleting kompetisi:', err)
      toast.error('Gagal menghapus kompetisi')
    }
  }
}

const saveKompetisi = async () => {
  try {
    if (!form.value.nama.trim()) {
      toast.warning('Nama kompetisi harus diisi')
      return
    }

    let response
    if (isEditing.value) {
      // Update existing kompetisi
      response = await fetch(`/api/kategori_kompetisi/${editingId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: form.value.nama.trim(),
          gambar: form.value.gambar.trim(),
          keterangan: form.value.keterangan.trim(),
          status: form.value.status
        })
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      })
    } else {
      // Create new kompetisi
      response = await fetch('/api/kategori_kompetisi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: form.value.nama.trim(),
          gambar: form.value.gambar.trim(),
          keterangan: form.value.keterangan.trim(),
          status: form.value.status
        })
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      })
    }

    if (response.success) {
      await fetchKompetisiData() // Refresh data
      closeModal()
      toast.success(isEditing.value ? 'Kompetisi berhasil diupdate' : 'Kompetisi berhasil ditambahkan')
    }
  } catch (err) {
    console.error('Error saving kompetisi:', err)
    toast.error('Gagal menyimpan kompetisi')
  }
}

const viewKompetisi = (item) => {
  // Implementasi view kompetisi
  alert('View: ' + item.nama)
}

onMounted(() => {
  fetchKompetisiData()
})
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>