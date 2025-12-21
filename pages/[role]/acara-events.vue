<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Acara Events</h1>
    <v-card>
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
            <v-btn icon small color="primary" @click="editItem(item)" title="Edit">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'sidebar'
})

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

const acaraData = [
  {
    no: 1,
    judul: 'Testing Event',
    tanggal: '2024-12-28',
    jam: '00:01:00',
    gambar: 'https://jippnas.menpan.go.id/storage/images/acara//r02brWqVP5k5baYi.jpg',
    keterangan: '<p>Test test event</p>',
    penyelenggara: 'Super Admin',
    status: 'Aktif',
    action: ''
  },
  {
    no: 2,
    judul: 'New Year Eve',
    tanggal: '2024-12-31',
    jam: '20:00:00',
    gambar: 'https://jippnas.menpan.go.id/storage/images/acara//TGSjWz9PnB2JDlGB.jpg',
    keterangan: '',
    penyelenggara: 'Super Admin',
    status: 'Aktif',
    action: ''
  },
  {
    no: 3,
    judul: 'uji coba',
    tanggal: '2024-12-26',
    jam: '11:30:00',
    gambar: 'https://jippnas.menpan.go.id/storage/images/acara//ISFG7s0JAUojsyXk.jpg',
    keterangan: '<p>untuk uji coba</p>',
    penyelenggara: 'Super Admin',
    status: 'Aktif',
    action: ''
  },
  {
    no: 4,
    judul: 'Perayaan Natal 2024',
    tanggal: '2024-12-25',
    jam: '10:00:00',
    gambar: 'https://jippnas.menpan.go.id/storage/images/acara//PXwLS4YHbFx5Jp6M.jpg',
    keterangan: '<p>Perayaan Natal 2024 pada tanggal 25 Desember 2024. Masyarakat merayakan natal bersama keluarga tercinta</p>',
    penyelenggara: 'Super Admin',
    status: 'Aktif',
    action: ''
  },
  {
    no: 5,
    judul: 'UAT Optimalisasi Web JIPPNas',
    tanggal: '2024-12-16',
    jam: '09:45:00',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    keterangan: '<p>UAT JIPPNas setelah optimalisasi web&nbsp;</p>',
    penyelenggara: 'Super Admin',
    status: 'Aktif',
    action: ''
  }
]

const editItem = (item) => {
  console.log('Edit item', item.judul)
}
</script>