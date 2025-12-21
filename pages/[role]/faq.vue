<script setup>
definePageMeta({
  layout: 'sidebar'
})

const search = ref('')

const faqData = ref([
  {
    no: 1,
    pertanyaan: 'Kenapa inovasi tidak ada foto atau gambarnya?',
    jawaban: 'Inovasi tidak muncul foto atau gambarnya dikarenakan inovator tidak mengunggah foto atau gambar di halaman inovasinya',
    status: 'Aktif'
  },
  {
    no: 2,
    pertanyaan: 'apa saja jenis inovasi yang ditampilkan pada JIPPNas?',
    jawaban: 'Jaringan Inovasi Pelayanan Publik Nasional (JIPPNas) adalah website yang menyediakan informasi terkait praktik baik inovasi pelayanan publik. tujuannya adalah antara lain agar informasi inovasi yang disampaikan dapat memberikan pengaruh positif kepada kinerja pemerintah, untuk mempelajari dan direplikasi sehingga menumbuhkan model inovasi pelayanan publik baru dan kendala dalam memberikan pelayanan publik yang tidak merata dapat diperbaiki. Mimpi besarnya adalah JIPPNas menjadi knowledge management system yang menyampaikan segala sesuatu yang menciptakan siklus perbaikan dan peningkatan kualitas pelayanan publik melalui penyebarluasan praktik baik inovasi pelayanan publik yang terarah. 5 tahun pertama tujuan JIPPNas tercapai yaitu mejududkan JIPPNas sebagai direktori praktik terbaik inovasi pelayanan publik. hal ini karena telah dilakukan serangkaian program yang menyatukan dan menyediakan informasi praktik baik inovasi pelayanan publik yang bersumber dari para pemangku pekentingan JIPPNas yaitu Kompetisi inovasi pelayanan publik (KIPP) yang bersumber dari Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (KemenPANRB), Innovative government award bersumber Kementerian Dalam Negeri (Kemendagri), dan Inovasi Inoland bersumber dari Lembaga Administrasi Negara (LAN).',
    status: 'Aktif'
  },
  {
    no: 3,
    pertanyaan: 'Apa pengertian inovasi pelayanan publik?',
    jawaban: 'Inovasi adalah terobosan gagagasan kreatif, orisinil/adaptasi, bermanfaat buat publik',
    status: 'Aktif'
  }
])

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Pertanyaan', key: 'pertanyaan' },
  { title: 'Jawaban', key: 'jawaban' },
  { title: 'Status', key: 'status', width: '100px' },
  { title: 'Action', key: 'actions', sortable: false, width: '150px' }
]

const editItem = (item) => {
  console.log('Edit item', item.pertanyaan)
}

const deleteItem = (item) => {
  console.log('Delete item', item.pertanyaan)
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen FAQ</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" href="https://jippnas.menpan.go.id/dashboard/faq/form">
          Tambah FAQ
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari FAQ"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="faqData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'Aktif' ? 'green' : 'red'" dark>
              {{ item.status }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon small color="primary" @click="editItem(item)" title="Edit">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small color="red" @click="deleteItem(item)" title="Trash">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>