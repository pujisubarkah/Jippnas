<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen UPP</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          Tambah UPP
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Judul"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="uppData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.action="{ item }">
            <div class="d-flex">
              <v-btn icon small color="blue" @click="logUpp(item)" title="Log">
                <v-icon>mdi-card-account-details</v-icon>
              </v-btn>
              <v-btn icon small color="primary" @click="editUpp(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deleteUpp(item)" title="Delete">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah/Edit UPP -->
    <v-dialog v-model="showModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit UPP' : 'Tambah UPP Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveUpp" class="space-y-4">
            <v-text-field
              v-model="form.nama"
              label="Nama UPP *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama UPP"
            ></v-text-field>

            <v-textarea
              v-model="form.keterangan"
              label="Keterangan"
              rows="4"
              variant="outlined"
              placeholder="Masukkan keterangan UPP"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal">Batal</v-btn>
          <v-btn color="primary" @click="saveUpp">
            {{ isEditing ? 'Update' : 'Simpan' }}
          </v-btn>
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
const rawUppData = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// Form data
const form = ref({
  nama: '',
  keterangan: ''
})

const breadcrumbItems = [
  {
    title: 'Daftar UPP',
    disabled: true,
  },
]

const headers = [
  { title: 'No.', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Action', key: 'action', sortable: false, width: '100px' }
]

const uppData = computed(() => {
  return rawUppData.value.map((item, index) => ({
    ...item,
    no: index + 1
  }))
})

const fetchUpp = async () => {
  try {
    const response = await $fetch('/api/upp')
    if (response.success) {
      rawUppData.value = response.data
    } else {
      console.error('Failed to fetch upp:', response.error)
      toast.error('Gagal memuat data UPP')
    }
  } catch (error) {
    console.error('Error fetching upp:', error)
    toast.error('Gagal memuat data UPP')
  }
}

onMounted(() => {
  fetchUpp()
})

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
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

const editUpp = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    nama: item.nama,
    keterangan: item.keterangan
  }
  showModal.value = true
}

const saveUpp = async () => {
  try {
    if (!form.value.nama.trim()) {
      toast.warning('Nama UPP harus diisi')
      return
    }

    let response
    if (isEditing.value) {
      // Update existing upp
      response = await $fetch(`/api/upp/${editingId.value}`, {
        method: 'PUT',
        body: {
          nama: form.value.nama.trim(),
          keterangan: form.value.keterangan.trim()
        }
      })
    } else {
      // Create new upp
      response = await $fetch('/api/upp', {
        method: 'POST',
        body: {
          nama: form.value.nama.trim(),
          keterangan: form.value.keterangan.trim()
        }
      })
    }

    if (response.success) {
      await fetchUpp() // Refresh data
      closeModal()
      toast.success(`UPP berhasil ${isEditing.value ? 'diupdate' : 'ditambahkan'}`)
    }
  } catch (error) {
    console.error('Error saving upp:', error)
    toast.error(`Gagal ${isEditing.value ? 'mengupdate' : 'menyimpan'} UPP`)
  }
}

const deleteUpp = async (item) => {
  if (confirm(`Apakah Anda yakin ingin menghapus "${item.nama}"?`)) {
    try {
      const response = await $fetch(`/api/upp/${item.id}`, {
        method: 'DELETE'
      })
      if (response.success) {
        await fetchUpp() // Refresh data
        toast.success('UPP berhasil dihapus')
      }
    } catch (error) {
      console.error('Error deleting upp:', error)
      toast.error('Gagal menghapus UPP')
    }
  }
}

function logUpp(item) {
  // Implementasi log upp
  alert('Log: ' + item.nama)
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>