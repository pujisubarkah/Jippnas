<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Peran Pengguna</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal" :loading="loading">
          Tambah Peran
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Peran"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="roleData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
          :loading="loading"
        >
          <template v-slot:item.created_at="{ item }">
            {{ item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-' }}
          </template>
          <template v-slot:item.updated_at="{ item }">
            {{ item.updated_at ? new Date(item.updated_at).toLocaleDateString('id-ID') : '-' }}
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex justify-center">
              <v-btn icon small color="primary" @click="editRole(item)" title="Edit" :disabled="loading">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="error" @click="deleteRole(item)" title="Hapus" :disabled="loading">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah/Edit Role -->
    <v-dialog v-model="showModal" max-width="600px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit Peran' : 'Tambah Peran Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveRole" class="space-y-4">
            <v-text-field
              v-model="form.nama"
              label="Nama *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama peran"
              :disabled="loading"
            ></v-text-field>

            <v-textarea
              v-model="form.keterangan"
              label="Keterangan"
              rows="4"
              variant="outlined"
              placeholder="Masukkan keterangan peran"
              :disabled="loading"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal" :disabled="loading">Batal</v-btn>
          <v-btn color="primary" @click="saveRole" :loading="loading">
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
const roleData = ref([])
const loading = ref(false)

// Modal state
const showModal = ref(false)
const isEditing = ref(false)
const editingItem = ref(null)

// Form data
const form = ref({
  nama: '',
  keterangan: ''
})

const breadcrumbItems = [
  {
    title: 'Daftar Peran',
    disabled: true,
  },
]

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Dibuat', key: 'created_at', width: '120px' },
  { title: 'Diupdate', key: 'updated_at', width: '120px' },
  { title: 'Action', key: 'action', sortable: false, width: '120px' }
]

// Fetch data from API
const fetchRoles = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/peran')
    if (response.success) {
      roleData.value = response.data
    } else {
      toast.error('Gagal memuat data peran')
    }
  } catch (error) {
    console.error('Error fetching roles:', error)
    toast.error('Terjadi kesalahan saat memuat data')
  } finally {
    loading.value = false
  }
}

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingItem.value = null
  form.value = {
    nama: '',
    keterangan: ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    nama: '',
    keterangan: ''
  }
}

const editRole = (item) => {
  isEditing.value = true
  editingItem.value = item
  form.value = {
    nama: item.nama,
    keterangan: item.keterangan
  }
  showModal.value = true
}

const deleteRole = async (item) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus peran "${item.nama}"?`)) {
    return
  }

  loading.value = true
  try {
    const response = await $fetch('/api/peran', {
      method: 'DELETE',
      body: { id: item.id }
    })

    if (response.success) {
      toast.success('Peran berhasil dihapus')
      await fetchRoles()
    } else {
      toast.error(response.error || 'Gagal menghapus peran')
    }
  } catch (error) {
    console.error('Error deleting role:', error)
    toast.error('Terjadi kesalahan saat menghapus peran')
  } finally {
    loading.value = false
  }
}

const saveRole = async () => {
  if (!form.value.nama.trim()) {
    toast.warning('Nama peran harus diisi')
    return
  }

  loading.value = true
  try {
    let response
    if (isEditing.value) {
      // Update
      response = await $fetch('/api/peran', {
        method: 'PUT',
        body: {
          id: editingItem.value.id,
          nama: form.value.nama.trim(),
          keterangan: form.value.keterangan.trim()
        }
      })
    } else {
      // Create
      response = await $fetch('/api/peran', {
        method: 'POST',
        body: {
          nama: form.value.nama.trim(),
          keterangan: form.value.keterangan.trim()
        }
      })
    }

    if (response.success) {
      toast.success(isEditing.value ? 'Peran berhasil diupdate' : 'Peran berhasil ditambahkan')
      await fetchRoles()
      closeModal()
    } else {
      toast.error(response.error || 'Gagal menyimpan peran')
    }
  } catch (error) {
    console.error('Error saving role:', error)
    toast.error('Terjadi kesalahan saat menyimpan peran')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRoles()
})
</script>