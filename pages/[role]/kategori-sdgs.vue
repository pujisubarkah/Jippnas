<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Kategori SDG's</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="addKategori">
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
          :items="kategoriList"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.icon_base64="{ item }">
            <img v-if="item.icon_base64" :src="'data:image/png;base64,' + item.icon_base64" width="100" height="100" style="object-fit: contain;" alt="Icon" />
            <span v-else>No Image</span>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'Aktif' ? 'success' : 'error'" variant="flat">{{ item.status }}</v-chip>
          </template>
          <template v-slot:item.aksi="{ item }">
            <div class="d-flex align-center" style="gap:8px;">
              <v-btn icon small color="primary" @click="editKategori(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deleteKategori(item)" title="Trash">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah/Edit Kategori -->
    <v-dialog v-model="dialog" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveKategori" class="space-y-4">
            <v-text-field
              v-model="form.nama_id"
              label="Nama (ID) *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama dalam bahasa Indonesia"
            ></v-text-field>

            <v-text-field
              v-model="form.nama_en"
              label="Nama (EN) *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama dalam bahasa Inggris"
            ></v-text-field>

            <div>
              <label class="v-label">Upload Icon</label>
              <div class="d-flex align-center mt-2 mb-2">
                <v-btn color="secondary" @click="$refs.fileInput.click()" class="mr-2">
                  Pilih File
                </v-btn>
                <span v-if="selectedFileName">{{ selectedFileName }}</span>
                <span v-else class="text-grey">Tidak ada file dipilih</span>
              </div>
              <input type="file" ref="fileInput" accept="image/*" @change="handleFileUpload" style="display: none;" />
              <div v-if="form.icon_base64" class="mt-2">
                <p>Preview:</p>
                <img :src="'data:image/png;base64,' + form.icon_base64" width="50" height="50" style="object-fit: contain;" alt="Preview" />
              </div>
            </div>

            <v-switch
              v-model="form.status"
              label="Status Aktif"
            ></v-switch>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeDialog">Batal</v-btn>
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

definePageMeta({
  layout: 'sidebar'
})

const search = ref('')

const breadcrumbItems = [
  {
    title: 'Manajemen Kategori SDG\'s',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama_id' },
  { title: 'Keterangan', key: 'nama_en' },
  { title: 'Gambar', key: 'icon_base64', width: '120px' },
  { title: 'Status', key: 'status', width: '80px' },
  { title: 'Aksi', key: 'aksi', sortable: false, width: '150px' }
]

const kategoriList = ref([])

const dialog = ref(false)
const isEditing = ref(false)
const selectedFileName = ref('')
const form = ref({
  id: null,
  nama_id: '',
  nama_en: '',
  icon_base64: '',
  status: true
})

onMounted(async () => {
  await fetchKategori()
})

async function fetchKategori() {
  try {
    const response = await $fetch('/api/sdgs')
    console.log('Fetched data:', response)
    if (response.success) {
      kategoriList.value = response.data.map((item, index) => ({
        ...item,
        no: index + 1,
        status: item.status ? 'Aktif' : 'Nonaktif'
      }))
    }
  } catch (error) {
    console.error('Error fetching kategori:', error)
  }
}

function addKategori() {
  isEditing.value = false
  selectedFileName.value = ''
  form.value = {
    id: null,
    nama_id: '',
    nama_en: '',
    icon_base64: '',
    status: true
  }
  dialog.value = true
}

function editKategori(item) {
  isEditing.value = true
  selectedFileName.value = item.icon_base64 ? 'File tersimpan' : ''
  form.value = {
    id: item.id,
    nama_id: item.nama_id,
    nama_en: item.nama_en,
    icon_base64: item.icon_base64,
    status: item.status === 'Aktif'
  }
  dialog.value = true
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    selectedFileName.value = file.name
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1]
      form.value.icon_base64 = base64
    }
    reader.readAsDataURL(file)
  } else {
    selectedFileName.value = ''
  }
}

async function saveKategori() {
  if (!form.value.nama_id || !form.value.nama_en) {
    alert('Nama (ID) dan Nama (EN) wajib diisi!')
    return
  }
  try {
    const body = {
      nama_id: form.value.nama_id,
      nama_en: form.value.nama_en,
      icon_base64: form.value.icon_base64,
      status: form.value.status
    }
    console.log('Saving:', body)
    if (isEditing.value) {
      await $fetch(`/api/sdgs/${form.value.id}`, {
        method: 'PUT',
        body
      })
    } else {
      await $fetch('/api/sdgs', {
        method: 'POST',
        body
      })
    }
    await fetchKategori()
    closeDialog()
  } catch (error) {
    console.error('Error saving kategori:', error)
    alert('Error saving: ' + error.message)
  }
}

function closeDialog() {
  dialog.value = false
}

function deleteKategori(item) {
  if (confirm('Yakin hapus kategori ' + item.nama_id + '?')) {
    $fetch(`/api/sdgs/${item.id}`, {
      method: 'DELETE'
    }).then(() => {
      fetchKategori()
    }).catch(error => {
      console.error('Error deleting kategori:', error)
    })
  }
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>