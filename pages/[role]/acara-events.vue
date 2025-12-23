<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Acara Events</h1>
    <v-card>
      <v-card-header>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          Tambah Acara/Events
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="acaraData"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.gambar="{ item }">
            <v-img :src="item.gambar" width="100" height="100" contain></v-img>
          </template>
          <template v-slot:item.keterangan="{ item }">
            <div v-html="item.keterangan"></div>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'Aktif' ? 'green' : 'red'" dark>{{ item.status }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex">
              <v-btn icon small color="primary" @click="editItem(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deleteItem(item)" title="Trash">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah/Edit Acara -->
    <v-dialog v-model="showModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit Acara' : 'Tambah Acara Baru' }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveAcara" class="space-y-4">
            <v-text-field
              v-model="form.judul"
              label="Judul *"
              required
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan judul acara"
            ></v-text-field>

            <v-text-field
              v-model="form.tanggal"
              label="Tanggal *"
              type="date"
              required
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.jam"
              label="Jam *"
              type="time"
              required
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.gambar"
              label="Gambar"
              type="url"
              variant="outlined"
              placeholder="Masukkan URL gambar"
            ></v-text-field>

            <v-textarea
              v-model="form.keterangan"
              label="Keterangan"
              rows="4"
              variant="outlined"
              placeholder="Masukkan keterangan acara"
            ></v-textarea>

            <v-text-field
              v-model="form.penyelenggara"
              label="Penyelenggara"
              maxlength="255"
              variant="outlined"
              placeholder="Masukkan nama penyelenggara"
            ></v-text-field>

            <v-select
              v-model="form.status"
              :items="['Aktif', 'Tidak Aktif']"
              label="Status"
              variant="outlined"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal">Batal</v-btn>
          <v-btn color="primary" @click="saveAcara">
            {{ isEditing ? 'Update' : 'Simpan' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'sidebar'
})

import { ref } from 'vue'
import { toast } from 'vue-sonner'

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Judul', key: 'judul' },
  { title: 'Tanggal', key: 'tanggal', width: '100px' },
  { title: 'Jam', key: 'jam', width: '80px' },
  { title: 'Gambar', key: 'gambar', width: '120px' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Penyelenggara', key: 'penyelenggara' },
  { title: 'Status', key: 'status', width: '80px' },
  { title: 'Action', key: 'action', sortable: false, width: '80px' }
]

const acaraData = ref([
  {
    no: 1,
    judul: 'Testing Event',
    tanggal: '2024-12-28',
    jam: '00:01:00',
    gambar: 'https://jippnas.menpan.go.id/storage/images/acara//r02brWqVP5k5baYi.jpg',
    keterangan: '<p>Test test event</p>',
    penyelenggara: 'Super Admin',
    status: 'Aktif'
  },
  {
    no: 2,
    judul: 'New Year Eve',
    tanggal: '2024-12-31',
    jam: '20:00:00',
    gambar: 'https://jippnas.menpan.go.id/storage/images/acara//TGSjWz9PnB2JDlGB.jpg',
    keterangan: '',
    penyelenggara: 'Super Admin',
    status: 'Aktif'
  },
  {
    no: 3,
    judul: 'uji coba',
    tanggal: '2024-12-26',
    jam: '11:30:00',
    gambar: 'https://jippnas.menpan.go.id/storage/images/acara//ISFG7s0JAUojsyXk.jpg',
    keterangan: '<p>untuk uji coba</p>',
    penyelenggara: 'Super Admin',
    status: 'Aktif'
  },
  {
    no: 4,
    judul: 'Perayaan Natal 2024',
    tanggal: '2024-12-25',
    jam: '10:00:00',
    gambar: 'https://jippnas.menpan.go.id/storage/images/acara//PXwLS4YHbFx5Jp6M.jpg',
    keterangan: '<p>Perayaan Natal 2024 pada tanggal 25 Desember 2024. Masyarakat merayakan natal bersama keluarga tercinta</p>',
    penyelenggara: 'Super Admin',
    status: 'Aktif'
  },
  {
    no: 5,
    judul: 'UAT Optimalisasi Web JIPPNas',
    tanggal: '2024-12-16',
    jam: '09:45:00',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    keterangan: '<p>UAT JIPPNas setelah optimalisasi web&nbsp;</p>',
    penyelenggara: 'Super Admin',
    status: 'Aktif'
  }
])

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingIndex = ref(null)

// Form data
const form = ref({
  judul: '',
  tanggal: '',
  jam: '',
  gambar: '',
  keterangan: '',
  penyelenggara: '',
  status: 'Aktif'
})

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingIndex.value = null
  form.value = {
    judul: '',
    tanggal: '',
    jam: '',
    gambar: '',
    keterangan: '',
    penyelenggara: '',
    status: 'Aktif'
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    judul: '',
    tanggal: '',
    jam: '',
    gambar: '',
    keterangan: '',
    penyelenggara: '',
    status: 'Aktif'
  }
}

const editItem = (item) => {
  isEditing.value = true
  editingIndex.value = acaraData.value.findIndex(acara => acara.no === item.no)
  form.value = {
    judul: item.judul,
    tanggal: item.tanggal,
    jam: item.jam,
    gambar: item.gambar,
    keterangan: item.keterangan,
    penyelenggara: item.penyelenggara,
    status: item.status
  }
  showModal.value = true
}

const deleteItem = (item) => {
  if (confirm(`Apakah Anda yakin ingin menghapus acara "${item.judul}"?`)) {
    const index = acaraData.value.findIndex(acara => acara.no === item.no)
    if (index > -1) {
      acaraData.value.splice(index, 1)
      toast.success('Acara berhasil dihapus')
    }
  }
}

const saveAcara = () => {
  if (!form.value.judul.trim() || !form.value.tanggal || !form.value.jam) {
    toast.warning('Judul, tanggal, dan jam harus diisi')
    return
  }

  if (isEditing.value) {
    // Update
    acaraData.value[editingIndex.value] = {
      ...acaraData.value[editingIndex.value],
      judul: form.value.judul.trim(),
      tanggal: form.value.tanggal,
      jam: form.value.jam,
      gambar: form.value.gambar.trim(),
      keterangan: form.value.keterangan.trim(),
      penyelenggara: form.value.penyelenggara.trim(),
      status: form.value.status
    }
    toast.success('Acara berhasil diupdate')
  } else {
    // Add new
    const newNo = acaraData.value.length > 0 ? Math.max(...acaraData.value.map(a => a.no)) + 1 : 1
    acaraData.value.push({
      no: newNo,
      judul: form.value.judul.trim(),
      tanggal: form.value.tanggal,
      jam: form.value.jam,
      gambar: form.value.gambar.trim(),
      keterangan: form.value.keterangan.trim(),
      penyelenggara: form.value.penyelenggara.trim(),
      status: form.value.status
    })
    toast.success('Acara berhasil ditambahkan')
  }
  closeModal()
}
</script>