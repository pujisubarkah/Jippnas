<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Instansi</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          Tambah Instansi
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Instansi"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="instansiData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.statusHub="{ item }">
            <v-chip :color="item.statusHub === 'Memiliki Hub' ? 'green' : 'red'" dark>{{ item.statusHub }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex">
              <v-btn icon small color="blue" @click="logInstansi(item)" title="Log">
                <v-icon>mdi-card-account-details</v-icon>
              </v-btn>
              <v-btn icon small color="primary" @click="editInstansi(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deleteInstansi(item)" title="Delete">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn icon small color="green" @click="statusHubInstansi(item)" title="Status Hub">
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah/Edit Instansi -->
    <v-dialog v-model="showModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit Instansi' : 'Tambah Instansi Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveInstansi" class="space-y-4">
            <v-text-field
              v-model="form.nama"
              label="Nama Instansi *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama instansi"
            ></v-text-field>

            <v-text-field
              v-model="form.singkatan"
              label="Singkatan"
              maxlength="100"
              variant="outlined"
              placeholder="Masukkan singkatan instansi"
            ></v-text-field>

            <v-textarea
              v-model="form.alamat"
              label="Alamat"
              rows="3"
              variant="outlined"
              placeholder="Masukkan alamat instansi"
            ></v-textarea>

            <v-text-field
              v-model="form.telp"
              label="Telepon"
              maxlength="20"
              variant="outlined"
              placeholder="Masukkan nomor telepon"
            ></v-text-field>

            <v-select
              v-model="form.status_hub"
              :items="[
                { title: 'Belum Memiliki Hub', value: false },
                { title: 'Memiliki Hub', value: true }
              ]"
              label="Status Hub"
              variant="outlined"
              item-title="title"
              item-value="value"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal">Batal</v-btn>
          <v-btn color="primary" @click="saveInstansi">
            {{ isEditing ? 'Update' : 'Simpan' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Log Instansi -->
    <v-dialog v-model="showLogModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          Log Aktivitas Instansi: {{ selectedInstansiName }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-data-table
            :headers="logHeaders"
            :items="logData"
            :items-per-page="10"
            class="elevation-1"
          ></v-data-table>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeLogModal">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'sidebar'
})

const search = ref('')
const rawInstansiData = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const showLogModal = ref(false)
const selectedInstansiName = ref('')
const logData = ref([])

// Form data
const form = ref({
  nama: '',
  singkatan: '',
  alamat: '',
  telp: '',
  status_hub: false
})

const breadcrumbItems = [
  {
    title: 'Daftar Instansi',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Singkatan', key: 'singkatan', width: '100px' },
  { title: 'Alamat', key: 'alamat' },
  { title: 'Telp', key: 'telp', width: '80px' },
  { title: 'Status Hub', key: 'statusHub', width: '100px' },
  { title: 'Action', key: 'action', sortable: false, width: '150px' }
]

const logHeaders = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Updated By', key: 'updated_by' },
  { title: 'Tanggal', key: 'tanggal' }
]

const instansiData = computed(() => {
  return rawInstansiData.value.map((item, index) => ({
    ...item,
    no: index + 1,
    statusHub: item.status_hub ? 'Memiliki Hub' : 'Belum Memiliki Hub'
  }))
})

const fetchInstansi = async () => {
  try {
    const response = await $fetch('/api/instansi')
    if (response.success) {
      rawInstansiData.value = response.data
    } else {
      console.error('Failed to fetch instansi:', response.error)
      toast.error('Gagal memuat data instansi')
    }
  } catch (error) {
    console.error('Error fetching instansi:', error)
    toast.error('Gagal memuat data instansi')
  }
}

onMounted(() => {
  fetchInstansi()
})

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    nama: '',
    singkatan: '',
    alamat: '',
    telp: '',
    status_hub: false
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    nama: '',
    singkatan: '',
    alamat: '',
    telp: '',
    status_hub: false
  }
}

const editInstansi = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    nama: item.nama,
    singkatan: item.singkatan,
    alamat: item.alamat,
    telp: item.telp,
    status_hub: item.status_hub
  }
  showModal.value = true
}

const saveInstansi = async () => {
  try {
    if (!form.value.nama.trim()) {
      toast.warning('Nama instansi harus diisi')
      return
    }

    let response
    if (isEditing.value) {
      // Update existing instansi
      response = await $fetch(`/api/instansi/${editingId.value}`, {
        method: 'PUT',
        body: {
          nama: form.value.nama.trim(),
          singkatan: form.value.singkatan.trim(),
          alamat: form.value.alamat.trim(),
          telp: form.value.telp.trim(),
          status_hub: form.value.status_hub
        }
      })
    } else {
      // Create new instansi
      response = await $fetch('/api/instansi', {
        method: 'POST',
        body: {
          nama: form.value.nama.trim(),
          singkatan: form.value.singkatan.trim(),
          alamat: form.value.alamat.trim(),
          telp: form.value.telp.trim(),
          status_hub: form.value.status_hub
        }
      })
    }

    if (response.success) {
      await fetchInstansi() // Refresh data
      closeModal()
      toast.success(`Instansi berhasil ${isEditing.value ? 'diupdate' : 'ditambahkan'}`)
    }
  } catch (error) {
    console.error('Error saving instansi:', error)
    toast.error(`Gagal ${isEditing.value ? 'mengupdate' : 'menyimpan'} instansi`)
  }
}

const deleteInstansi = async (item) => {
  if (confirm(`Apakah Anda yakin ingin menghapus "${item.nama}"?`)) {
    try {
      const response = await $fetch(`/api/instansi/${item.id}`, {
        method: 'DELETE'
      })
      if (response.success) {
        await fetchInstansi() // Refresh data
        toast.success('Instansi berhasil dihapus')
      }
    } catch (error) {
      console.error('Error deleting instansi:', error)
      toast.error('Gagal menghapus instansi')
    }
  }
}

const logInstansi = (item) => {
  selectedInstansiName.value = item.nama
  // Dummy log data - replace with actual API call
  logData.value = [
    { no: 1, nama: 'Update Nama', updated_by: 'Admin', tanggal: '2023-10-01' },
    { no: 2, nama: 'Update Alamat', updated_by: 'User1', tanggal: '2023-10-02' },
    { no: 3, nama: 'Update Status', updated_by: 'Admin', tanggal: '2023-10-03' }
  ]
  showLogModal.value = true
}

const closeLogModal = () => {
  showLogModal.value = false
  logData.value = []
}

function statusHubInstansi(item) {
  // Implementasi ubah status hub instansi
  alert('Status Hub: ' + item.nama)
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>