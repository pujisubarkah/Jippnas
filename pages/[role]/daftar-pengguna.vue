<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Daftar Pengguna</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          Tambah Pengguna
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Pengguna"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="penggunaData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
          :loading="loading"
        >
          <template v-slot:item.is_verified="{ item }">
            <v-chip :color="item.is_verified ? 'green' : 'red'" dark>{{ item.is_verified ? 'Verified' : 'Not Verified' }}</v-chip>
          </template>
          <template v-slot:item.created_at="{ item }">
            {{ new Date(item.created_at).toLocaleDateString() }}
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex align-center" style="gap:8px;">
              <v-btn icon small color="primary" @click="editPengguna(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deletePengguna(item)" title="Delete">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah/Edit Pengguna -->
    <v-dialog v-model="showModal" max-width="600px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit Pengguna' : 'Tambah Pengguna Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="savePengguna" class="space-y-4">
            <v-text-field
              v-model="form.username"
              label="Username *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan username"
            ></v-text-field>

            <v-text-field
              v-model="form.email"
              label="Email *"
              type="email"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan email"
            ></v-text-field>

            <v-text-field
              v-if="!isEditing"
              v-model="form.password"
              label="Password *"
              type="password"
              required
              variant="outlined"
              placeholder="Masukkan password"
            ></v-text-field>

            <v-radio-group v-model="form.role" inline label="Role *">
              <v-radio label="Admin" value="admin"></v-radio>
              <v-radio label="User" value="user"></v-radio>
            </v-radio-group>

            <v-checkbox
              v-model="form.is_verified"
              label="Verified"
            ></v-checkbox>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal">Batal</v-btn>
          <v-btn color="primary" @click="savePengguna">
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
const penggunaData = ref([])
const loading = ref(true)
const error = ref(null)

// Modal state
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// Form data
const form = ref({
  username: '',
  email: '',
  password: '',
  role: 'user',
  is_verified: false
})

const breadcrumbItems = [
  {
    title: 'Daftar Pengguna',
    disabled: true,
  },
]

const headers = [
  { title: 'No.', key: 'no', width: '50px' },
  { title: 'Username', key: 'username' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role', width: '80px' },
  { title: 'Verified', key: 'is_verified', width: '100px' },
  { title: 'Created At', key: 'created_at', width: '120px' },
  { title: 'Action', key: 'action', sortable: false, width: '100px' }
]

// Fetch data from API
const fetchPenggunaData = async () => {
  try {
    loading.value = true
    const response = await fetch('/api/users').then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      return res.json()
    })
    if (response.success) {
      // Add 'no' field for numbering
      penggunaData.value = response.data.map((item, index) => ({
        ...item,
        no: index + 1
      }))
    } else {
      throw new Error('Failed to fetch data')
    }
  } catch (err) {
    console.error('Error fetching pengguna data:', err)
    error.value = 'Failed to load data'
    toast.error('Gagal memuat data pengguna')
  } finally {
    loading.value = false
  }
}

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    username: '',
    email: '',
    password: '',
    role: 'user',
    is_verified: false
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    username: '',
    email: '',
    password: '',
    role: 'user',
    is_verified: false
  }
}

const editPengguna = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    username: item.username,
    email: item.email,
    password: '', // Don't populate password for edit
    role: item.role,
    is_verified: item.is_verified
  }
  showModal.value = true
}

const deletePengguna = async (item) => {
  if (confirm(`Apakah Anda yakin ingin menghapus pengguna "${item.username}"?`)) {
    try {
      const response = await fetch(`/api/users/${item.id}`, {
        method: 'DELETE'
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      })
      if (response.success) {
        await fetchPenggunaData() // Refresh data
        toast.success('Pengguna berhasil dihapus')
      }
    } catch (err) {
      console.error('Error deleting pengguna:', err)
      toast.error('Gagal menghapus pengguna')
    }
  }
}

const savePengguna = async () => {
  try {
    if (!form.value.username.trim() || !form.value.email.trim()) {
      toast.warning('Username dan email harus diisi')
      return
    }
    if (!isEditing.value && !form.value.password.trim()) {
      toast.warning('Password harus diisi untuk pengguna baru')
      return
    }

    let response
    if (isEditing.value) {
      // Update existing pengguna
      response = await fetch(`/api/users/${editingId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.value.username.trim(),
          email: form.value.email.trim(),
          role: form.value.role,
          is_verified: form.value.is_verified
        })
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      })
    } else {
      // Create new pengguna
      response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.value.username.trim(),
          email: form.value.email.trim(),
          password: form.value.password.trim(),
          role: form.value.role,
          is_verified: form.value.is_verified
        })
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      })
    }

    if (response.success) {
      await fetchPenggunaData() // Refresh data
      closeModal()
      toast.success(isEditing.value ? 'Pengguna berhasil diupdate' : 'Pengguna berhasil ditambahkan')
    }
  } catch (err) {
    console.error('Error saving pengguna:', err)
    toast.error('Gagal menyimpan pengguna')
  }
}

onMounted(() => {
  fetchPenggunaData()
})
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>