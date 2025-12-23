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
        <v-btn color="primary" @click="openAddModal">
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
          <template v-slot:item.action="{ item }">
            <v-btn icon small color="primary" @click="editRole(item)" title="Edit">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
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
            ></v-text-field>

            <v-textarea
              v-model="form.keterangan"
              label="Keterangan"
              rows="4"
              variant="outlined"
              placeholder="Masukkan keterangan peran"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal">Batal</v-btn>
          <v-btn color="primary" @click="saveRole">
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
const roleData = ref([
  { no: 1, nama: 'Member', keterangan: 'Member' },
  { no: 2, nama: 'Super Admin', keterangan: 'Super Admin' },
  { no: 3, nama: 'Admin Pembina', keterangan: 'Admin Pusat' },
  { no: 4, nama: 'Admin Instansi', keterangan: 'Admin Lokal' },
  { no: 5, nama: 'Admin Upp', keterangan: 'Admin Upp' },
  { no: 6, nama: 'UPP', keterangan: 'UPP' },
  { no: 7, nama: '<h1>admin upp</h1>', keterangan: 'admin upp' },
  { no: 8, nama: 'Tes', keterangan: '"&gt;&lt;script&gt;alert(Tes1)&lt;/script&gt;' }
])
const loading = ref(false)

// Modal state
const showModal = ref(false)
const isEditing = ref(false)
const editingIndex = ref(null)

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
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Action', key: 'action', sortable: false, width: '100px' }
]

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingIndex.value = null
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
  editingIndex.value = roleData.value.indexOf(item)
  form.value = {
    nama: item.nama,
    keterangan: item.keterangan
  }
  showModal.value = true
}

const deleteRole = async (item) => {
  if (confirm(`Apakah Anda yakin ingin menghapus peran "${item.nama}"?`)) {
    roleData.value = roleData.value.filter(r => r.no !== item.no)
    toast.success('Peran berhasil dihapus')
  }
}

const saveRole = () => {
  if (!form.value.nama.trim()) {
    toast.warning('Nama peran harus diisi')
    return
  }

  if (isEditing.value) {
    // Update
    roleData.value[editingIndex.value] = {
      ...roleData.value[editingIndex.value],
      nama: form.value.nama.trim(),
      keterangan: form.value.keterangan.trim()
    }
    toast.success('Peran berhasil diupdate')
  } else {
    // Add new
    const newNo = roleData.value.length + 1
    roleData.value.push({
      no: newNo,
      nama: form.value.nama.trim(),
      keterangan: form.value.keterangan.trim()
    })
    toast.success('Peran berhasil ditambahkan')
  }

  closeModal()
}

onMounted(() => {
  // Data already loaded
})
</script>

<style scoped>
.text-red {
  color: #dc3545;
}

.text-red-md {
  color: #c82333;
}

.text-bold {
  font-weight: bold;
}

.bg-semi-reds {
  background-color: #f8d7da;
}

.table-hovered tbody tr:hover {
  background-color: #f5f5f5;
}

.breadcrumb {
  background-color: transparent;
  border-bottom: 1px solid #dee2e6;
}

.breadcrumb-item.active {
  color: #c82333;
  font-weight: bold;
}
</style>