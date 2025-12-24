<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Daftar Bacaan</h1>

    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Cari Judul"
              class="mx-4"
            ></v-text-field>
          </template>

          <template v-slot:item.action="{ item }">
            <div class="d-flex gap-2">
              <v-btn
                icon
                color="primary"
                @click="viewInnovation(item)"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn
                icon
                color="error"
                @click="deleteBookmark(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'sidebar' })
import { ref } from 'vue'

const search = ref('')

const headers = [
  { title: 'No', key: 'no', width: '40px' },
  { title: 'Judul Inovasi', key: 'judul', width: '848px' },
  { title: 'Ditandai Oleh', key: 'ditandai_oleh', width: '130px' },
  { title: 'Action', key: 'action', width: '71px' }
]

const items = ref([
  {
    no: 1,
    judul: 'Sistem Informasi Jabatan Provinsi Riau (SI-JABPRI)',
    ditandai_oleh: 'Super Admin',
    inovasi_url: 'https://jippnas.menpan.go.id/inovasi/19',
    delete_url: 'https://jippnas.menpan.go.id/dashboard/mark/delete/19'
  },
  {
    no: 2,
    judul: 'SIPEKAT: Sistem Pengelolaan Kenaikan Pangkat',
    ditandai_oleh: 'Super Admin',
    inovasi_url: 'https://jippnas.menpan.go.id/inovasi/18',
    delete_url: 'https://jippnas.menpan.go.id/dashboard/mark/delete/18'
  },
  {
    no: 3,
    judul: 'PUTIKSARI (KAMPUNG TEMATIK WONOSARI BERSERI)',
    ditandai_oleh: 'Super Admin',
    inovasi_url: 'https://jippnas.menpan.go.id/inovasi/17',
    delete_url: 'https://jippnas.menpan.go.id/dashboard/mark/delete/17'
  },
  {
    no: 4,
    judul: 'Misteri Calon Pengantin Paseso Merapi (Pengurangan Resiko Bencana Berbasis Masyarakat)',
    ditandai_oleh: 'Super Admin',
    inovasi_url: 'https://jippnas.menpan.go.id/inovasi/14',
    delete_url: 'https://jippnas.menpan.go.id/dashboard/mark/delete/14'
  },
  {
    no: 5,
    judul: 'Meningkatkan Pelaksanaan Lelang yang Efisien, Kompetitif dan Adil Melalui Pelaksanaan e-Auction',
    ditandai_oleh: 'Super Admin',
    inovasi_url: 'https://jippnas.menpan.go.id/inovasi/11',
    delete_url: 'https://jippnas.menpan.go.id/dashboard/mark/delete/11'
  },
  {
    no: 6,
    judul: 'Lapo BRA (Layanan Pojok Braille)',
    ditandai_oleh: 'Super Admin',
    inovasi_url: 'https://jippnas.menpan.go.id/inovasi/12',
    delete_url: 'https://jippnas.menpan.go.id/dashboard/mark/delete/12'
  },
  {
    no: 7,
    judul: 'KOPI PAHIT (Kompilasi Inovasi Porong Cegah dan Atasi Stunting)',
    ditandai_oleh: 'Super Admin',
    inovasi_url: 'https://jippnas.menpan.go.id/inovasi/15',
    delete_url: 'https://jippnas.menpan.go.id/dashboard/mark/delete/15'
  },
  {
    no: 8,
    judul: 'Informasi Zona Potensi Penangkapan Ikan (ZPPI) untuk Peningkatan Perekonomian Nelayan Indonesia',
    ditandai_oleh: 'Super Admin',
    inovasi_url: 'https://jippnas.menpan.go.id/inovasi/13',
    delete_url: 'https://jippnas.menpan.go.id/dashboard/mark/delete/13'
  }
])

const viewInnovation = (item) => {
  window.open(item.inovasi_url, '_blank')
}

const deleteBookmark = (item) => {
  if (confirm('Apakah Anda yakin ingin menghapus bookmark ini?')) {
    // Handle delete logic here
    console.log('Deleting bookmark:', item)
  }
}
</script>

<style scoped>
.gap-2 > * + * {
  margin-left: 0.5rem;
}

.d-flex {
  display: flex;
}
</style>