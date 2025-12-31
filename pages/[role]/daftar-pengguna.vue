<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Daftar Pengguna</h1>

    <v-card>
      <v-card-header>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal" :loading="loading">
          Tambah Pengguna
        </v-btn>
      </v-card-header>

      <v-card-text>
        <v-text-field
          v-model="search"
          label="Masukkan kalimat kunci"
          class="mb-4"
          :disabled="loading"
        ></v-text-field>

        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
          :loading="loading"
        >
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.is_active === 'Aktif' ? 'success' : 'error'"
              size="small"
            >
              {{ item.is_active || 'Non Aktif' }}
            </v-chip>
          </template>

          <template v-slot:item.last_login="{ item }">
            {{ item.last_login ? new Date(item.last_login).toLocaleString('id-ID') : '-' }}
          </template>

          <template v-slot:item.action="{ item }">
            <div class="d-flex justify-center">
              <v-btn icon small color="primary" @click="editUser(item)" title="Edit" :disabled="loading">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="error" @click="deleteUser(item)" title="Hapus" :disabled="loading">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah/Edit User -->
    <v-dialog v-model="showModal" max-width="600px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit Pengguna' : 'Tambah Pengguna Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveUser" class="space-y-4">
            <v-text-field
              v-model="form.name"
              label="Nama *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama pengguna"
              :disabled="loading"
            ></v-text-field>

            <v-text-field
              v-model="form.email"
              label="Email *"
              type="email"
              required
              variant="outlined"
              placeholder="Masukkan email"
              :disabled="loading"
            ></v-text-field>

            <v-text-field
              v-model="form.telp"
              label="No. Telpon"
              variant="outlined"
              placeholder="Masukkan no. telpon"
              :disabled="loading"
            ></v-text-field>

            <v-select
              v-model="form.id_peran"
              :items="roleOptions"
              item-title="nama"
              item-value="id"
              label="Role *"
              variant="outlined"
              placeholder="Pilih role"
              :disabled="loading"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal" :disabled="loading">Batal</v-btn>
          <v-btn color="primary" @click="saveUser" :loading="loading">
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

definePageMeta({ layout: 'sidebar' })

const search = ref('')
const items = ref([])
const loading = ref(false)
const roles = ref([])

// Modal state
const showModal = ref(false)
const isEditing = ref(false)
const editingItem = ref(null)

// Form data
const form = ref({
  name: '',
  email: '',
  telp: '',
  id_peran: null
})

const headers = [
  { title: 'No', key: 'no', width: '18px' },
  { title: 'Nama', key: 'name', width: '212px' },
  { title: 'Instansi', key: 'nm_instansi', width: '84px' },
  { title: 'UPP', key: 'nm_upp', width: '196px' },
  { title: 'Username', key: 'username', width: '72px' },
  { title: 'Email', key: 'email', width: '194px' },
  { title: 'No. Telpon', key: 'telp', width: '87px' },
  { title: 'Role', key: 'nm_peran', width: '34px' },
  { title: 'Status', key: 'is_active', width: '138px' },
  { title: 'PKRI', key: 'pkri', width: '31px' },
  { title: 'Gagal Login', key: 'gagal_login', width: '37px' },
  { title: 'Last Online', key: 'last_login', width: '40px' },
  { title: 'Action', key: 'action', width: '120px' }
]

const roleOptions = ref([])

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/users')
    if (response.success) {
      items.value = response.data.map((item, index) => ({
        ...item,
        no: index + 1,
        pkri: item.is_del ? 'Y' : 'N',
        gagal_login: '' // Not in API, set to empty
      }))
    } else {
      toast.error('Gagal memuat data pengguna')
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    toast.error('Terjadi kesalahan saat memuat data')
  } finally {
    loading.value = false
  }
}

const fetchRoles = async () => {
  try {
    const response = await $fetch('/api/peran')
    if (response.success) {
      roles.value = response.data
      roleOptions.value = response.data.map(role => ({ title: role.nama, value: role.id }))
    }
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingItem.value = null
  form.value = {
    name: '',
    email: '',
    telp: '',
    id_peran: null
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    name: '',
    email: '',
    telp: '',
    id_peran: null
  }
}

const editUser = (item) => {
  isEditing.value = true
  editingItem.value = item
  form.value = {
    name: item.name,
    email: item.email,
    telp: item.telp,
    id_peran: item.id_peran
  }
  showModal.value = true
}

const deleteUser = async (item) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${item.name}"?`)) {
    return
  }

  loading.value = true
  try {
    const response = await $fetch(`/api/users/${item.id}`, {
      method: 'DELETE'
    })

    if (response.success) {
      toast.success('Pengguna berhasil dihapus')
      await fetchUsers()
    } else {
      toast.error(response.error || 'Gagal menghapus pengguna')
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    toast.error('Terjadi kesalahan saat menghapus pengguna')
  } finally {
    loading.value = false
  }
}

const saveUser = async () => {
  if (!form.value.name.trim() || !form.value.email.trim() || !form.value.id_peran) {
    toast.warning('Nama, email, dan role harus diisi')
    return
  }

  loading.value = true
  try {
    let response
    if (isEditing.value) {
      // Update
      response = await $fetch(`/api/users/${editingItem.value.id}`, {
        method: 'PUT',
        body: {
          name: form.value.name.trim(),
          email: form.value.email.trim(),
          telp: form.value.telp.trim(),
          id_peran: form.value.id_peran
        }
      })
    } else {
      // Create
      response = await $fetch('/api/users', {
        method: 'POST',
        body: {
          name: form.value.name.trim(),
          email: form.value.email.trim(),
          telp: form.value.telp.trim(),
          id_peran: form.value.id_peran
        }
      })
    }

    if (response.success) {
      toast.success(isEditing.value ? 'Pengguna berhasil diupdate' : 'Pengguna berhasil ditambahkan')
      await fetchUsers()
      closeModal()
    } else {
      toast.error(response.error || 'Gagal menyimpan pengguna')
    }
  } catch (error) {
    console.error('Error saving user:', error)
    toast.error('Terjadi kesalahan saat menyimpan pengguna')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchRoles()
  await fetchUsers()
})
</script>

<style scoped>
.gap-2 > * + * {
  margin-left: 0.5rem;
}

.d-flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}
</style>