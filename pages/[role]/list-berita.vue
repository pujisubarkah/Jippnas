<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Berita</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" href="https://jippnas.menpan.go.id/dashboard/berita/form">
          Tambah Berita
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Masukkan kalimat kunci"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="beritaData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.no="{ item, index }">
            <div class="text-left">{{ index + 1 }}</div>
          </template>
          <template v-slot:item.judul="{ item }">
            <div class="text-left font-semibold">{{ item.judul }}</div>
          </template>
          <template v-slot:item.img="{ item }">
            <v-img :src="item.img" width="150" height="150" contain></v-img>
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex">
              <v-btn icon small color="primary" @click="editBerita(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deleteBerita(item)" title="Delete">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="showAddDialog" max-width="800">
      <v-card>
        <v-card-title>
          {{ isEditing ? 'Edit Berita' : 'Tambah Berita Baru' }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveBerita">
            <v-text-field
              v-model="beritaForm.judul"
              label="Judul"
              required
            />
            <v-textarea
              v-model="beritaForm.deskripsi"
              label="Deskripsi"
              rows="8"
              required
            />
            <v-text-field
              v-model="beritaForm.tag"
              label="Tag"
              required
            />
            <v-text-field
              v-model="beritaForm.img"
              label="URL Gambar"
              placeholder="https://example.com/image.jpg"
            />
            <v-btn type="submit" color="primary" :loading="saving">
              {{ isEditing ? 'Update' : 'Simpan' }}
            </v-btn>
          </v-form>
        </v-card-text>
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
const saving = ref(false)
const showAddDialog = ref(false)
const isEditing = ref(false)

const breadcrumbItems = [
  {
    title: 'Daftar Berita',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', align: 'start' },
  { title: 'Judul', key: 'judul', align: 'start' },
  { title: 'Deskripsi', key: 'deskripsi' },
  { title: 'Tag', key: 'tag' },
  { title: 'IMG', key: 'img', width: '160px' },
  { title: 'Action', key: 'action', sortable: false, width: '100px' }
]

const beritaForm = ref({
  id: null,
  judul: '',
  deskripsi: '',
  tag: '',
  img: ''
})

const beritaData = ref([])
onMounted(async () => {
  const response = await $fetch('/api/berita')
  beritaData.value = response?.data || []
})

function editBerita(item) {
  isEditing.value = true
  beritaForm.value = { ...item }
  showAddDialog.value = true
}

function deleteBerita(item) {
  if (confirm('Hapus berita "' + item.judul + '"?')) {
    beritaData.value = beritaData.value.filter(b => b.id !== item.id)
  }
}

function saveBerita() {
  saving.value = true
  try {
    if (isEditing.value) {
      const index = beritaData.value.findIndex(b => b.id === beritaForm.value.id)
      if (index !== -1) {
        beritaData.value[index] = { ...beritaForm.value }
      }
    } else {
      const newBerita = {
        ...beritaForm.value,
        id: Date.now()
      }
      beritaData.value.push(newBerita)
    }
    beritaForm.value = {
      id: null,
      judul: '',
      deskripsi: '',
      tag: '',
      img: ''
    }
    showAddDialog.value = false
    isEditing.value = false
  } catch (error) {
    console.error('Error saving berita:', error)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>