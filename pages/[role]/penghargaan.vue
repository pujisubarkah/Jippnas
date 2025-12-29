<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Penghargaan</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          Tambah Penghargaan
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Penghargaan"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="penghargaanData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.gambar="{ item }">
            <img v-if="item.gambar" :src="'data:image/png;base64,' + item.gambar" width="100" height="100" style="object-fit: contain;" alt="Icon" />
            <span v-else>No Image</span>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status ? 'success' : 'error'" variant="flat">{{ item.status ? 'Aktif' : 'Tidak Aktif' }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex">
              <v-btn icon small color="primary" @click="editPenghargaan(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deletePenghargaan(item)" title="Delete">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah/Edit Penghargaan -->
    <v-dialog v-model="showModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit Penghargaan' : 'Tambah Penghargaan Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="savePenghargaan" class="space-y-4">
            <v-text-field
              v-model="form.nama"
              label="Nama Penghargaan *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama penghargaan"
            ></v-text-field>

            <div>
              <label class="v-label">Upload Gambar</label>
              <div class="d-flex align-center mt-2 mb-2">
                <v-btn color="secondary" @click="$refs.fileInput.click()" class="mr-2">
                  Pilih File
                </v-btn>
                <span v-if="selectedFileName">{{ selectedFileName }}</span>
                <span v-else class="text-grey">Tidak ada file dipilih</span>
              </div>
              <input type="file" ref="fileInput" accept="image/*" @change="handleFileUpload" style="display: none;" />
              <div v-if="form.gambar" class="mt-2">
                <p>Preview:</p>
                <img :src="'data:image/png;base64,' + form.gambar" width="50" height="50" style="object-fit: contain;" alt="Preview" />
              </div>
            </div>

            <v-textarea
              v-model="form.keterangan"
              label="Keterangan"
              rows="3"
              variant="outlined"
              placeholder="Masukkan keterangan penghargaan"
            ></v-textarea>

            <v-switch
              v-model="form.status"
              label="Status Aktif"
            ></v-switch>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal">Batal</v-btn>
          <v-btn color="primary" @click="savePenghargaan">
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
const rawPenghargaanData = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const selectedFileName = ref('')

// Form data
const form = ref({
  nama: '',
  gambar: '',
  keterangan: '',
  status: true
})

const breadcrumbItems = [
  {
    title: 'Daftar Penghargaan',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Gambar', key: 'gambar', width: '120px' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Status', key: 'status', width: '80px' },
  { title: 'Action', key: 'action', sortable: false, width: '100px' }
]

const penghargaanData = computed(() => {
  return rawPenghargaanData.value.map((item, index) => ({
    ...item,
    no: index + 1
  }))
})

const fetchPenghargaan = async () => {
  try {
    const response = await $fetch('/api/penghargaan')
    if (response.success) {
      rawPenghargaanData.value = response.data
    } else {
      console.error('Failed to fetch penghargaan:', response.error)
      toast.error('Gagal memuat data penghargaan')
    }
  } catch (error) {
    console.error('Error fetching penghargaan:', error)
    toast.error('Gagal memuat data penghargaan')
  }
}

onMounted(() => {
  fetchPenghargaan()
})

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  selectedFileName.value = ''
  form.value = {
    nama: '',
    gambar: '',
    keterangan: '',
    status: true
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedFileName.value = ''
  form.value = {
    nama: '',
    gambar: '',
    keterangan: '',
    status: true
  }
}

const editPenghargaan = (item) => {
  isEditing.value = true
  editingId.value = item.id
  selectedFileName.value = item.gambar ? 'File tersimpan' : ''
  form.value = {
    nama: item.nama,
    gambar: item.gambar,
    keterangan: item.keterangan,
    status: item.status
  }
  showModal.value = true
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    selectedFileName.value = file.name
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1]
      form.value.gambar = base64
    }
    reader.readAsDataURL(file)
  } else {
    selectedFileName.value = ''
  }
}

const savePenghargaan = async () => {
  if (!form.value.nama.trim()) {
    toast.warning('Nama penghargaan harus diisi')
    return
  }
  try {
    const body = {
      nama: form.value.nama.trim(),
      gambar: form.value.gambar,
      keterangan: form.value.keterangan.trim(),
      status: form.value.status
    }
    console.log('Saving:', body)
    let response
    if (isEditing.value) {
      response = await $fetch(`/api/penghargaan/${editingId.value}`, {
        method: 'PUT',
        body
      })
    } else {
      response = await $fetch('/api/penghargaan', {
        method: 'POST',
        body
      })
    }
    if (response.success) {
      await fetchPenghargaan()
      closeModal()
      toast.success(`Penghargaan berhasil ${isEditing.value ? 'diupdate' : 'ditambahkan'}`)
    }
  } catch (error) {
    console.error('Error saving penghargaan:', error)
    toast.error(`Gagal ${isEditing.value ? 'mengupdate' : 'menyimpan'} penghargaan`)
  }
}

const deletePenghargaan = async (item) => {
  if (confirm(`Apakah Anda yakin ingin menghapus "${item.nama}"?`)) {
    try {
      const response = await $fetch(`/api/penghargaan/${item.id}`, {
        method: 'DELETE'
      })
      if (response.success) {
        await fetchPenghargaan()
        toast.success('Penghargaan berhasil dihapus')
      }
    } catch (error) {
      console.error('Error deleting penghargaan:', error)
      toast.error('Gagal menghapus penghargaan')
    }
  }
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>