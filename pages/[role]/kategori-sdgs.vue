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
          <template v-slot:item.gambar="{ item }">
            <v-img :src="item.gambar" width="100" height="100" contain></v-img>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'Aktif' ? 'green' : 'red'" dark>{{ item.status }}</v-chip>
          </template>
          <template v-slot:item.aksi="{ item }">
            <div class="d-flex align-center" style="gap:8px;">
              <v-btn icon small color="primary" @click="editKategori(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deleteKategori(item)" title="Trash">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn icon small color="blue" @click="viewKategori(item)" title="View">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Dialog for Add/Edit -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ isEditing ? 'Edit Kategori' : 'Tambah Kategori' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.nama"
                  label="Nama"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.keterangan"
                  label="Keterangan"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.gambar"
                  label="Gambar URL"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.tahun"
                  label="Tahun"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.jenis"
                  label="Jenis"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="form.status"
                  label="Status Aktif"
                ></v-switch>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveKategori">
            Save
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
  { title: 'Nama', key: 'nama' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Gambar', key: 'gambar', width: '120px' },
  { title: 'Status', key: 'status', width: '80px' },
  { title: 'Aksi', key: 'aksi', sortable: false, width: '150px' }
]

const kategoriList = ref([])

const dialog = ref(false)
const isEditing = ref(false)
const form = ref({
  id: null,
  nama: '',
  keterangan: '',
  gambar: '',
  tahun: '',
  jenis: '',
  status: true
})

onMounted(async () => {
  await fetchKategori()
})

async function fetchKategori() {
  try {
    const response = await $fetch('/api/kategori-sdgs')
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
  form.value = {
    id: null,
    nama: '',
    keterangan: '',
    gambar: '',
    tahun: '',
    jenis: '',
    status: true
  }
  dialog.value = true
}

function editKategori(item) {
  isEditing.value = true
  form.value = {
    id: item.id,
    nama: item.nama,
    keterangan: item.keterangan,
    gambar: item.gambar,
    tahun: item.tahun,
    jenis: item.jenis,
    status: item.status === 'Aktif'
  }
  dialog.value = true
}

async function saveKategori() {
  try {
    if (isEditing.value) {
      await $fetch(`/api/kategori-sdgs/${form.value.id}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      await $fetch('/api/kategori-sdgs', {
        method: 'POST',
        body: form.value
      })
    }
    await fetchKategori()
    closeDialog()
  } catch (error) {
    console.error('Error saving kategori:', error)
  }
}

function closeDialog() {
  dialog.value = false
}

function deleteKategori(item) {
  // Implementasi hapus kategori
  if (confirm('Yakin hapus kategori ' + item.nama + '?')) {
    // Call delete API
    $fetch(`/api/kategori-sdgs/${item.id}`, {
      method: 'DELETE'
    }).then(() => {
      fetchKategori()
    }).catch(error => {
      console.error('Error deleting kategori:', error)
    })
  }
}

function viewKategori(item) {
  // Implementasi view kategori
  alert('View: ' + item.nama)
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>