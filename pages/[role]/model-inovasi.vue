<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Model Inovasi</h1>
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="modelData"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.gambar="{ item }">
            <v-img :src="item.gambar" width="100" height="100" contain></v-img>
          </template>
          <template v-slot:item.keterangan="{ item }">
            <div v-html="item.keterangan"></div>
          </template>
          <template v-slot:item.aksi="{ item }">
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

<script setup>
definePageMeta({
  layout: 'sidebar'
})

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Judul', key: 'judul' },
  { title: 'Gambar', key: 'gambar', width: '120px' },
  { title: 'File', key: 'file', width: '80px' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Aksi', key: 'aksi', sortable: false, width: '100px' }
]

const modelData = [
  {
    no: 1,
    judul: 'Model Inovasi Pelayanan Publik Bidang Digitalisasi Administrasi Pemerintahan',
    gambar: 'https://jippnas.menpan.go.id/storage/images/modelinov//QnoEFXt3Ou6ooozA.jpg',
    file: 'Tersedia',
    keterangan: '<p>Bentuk pembelajaran dari inovasi pelayanan publik terkait bagaimana penyelenggaraan digitalisasi administrasi pemerintahan dapat dilakukan dengan efektif dan efisien tanpa mengenyampingkan aspek inovatifnya. Model ini memberikan perhatian pada langkah-langkah praktis yang dapat dilakukan oleh instansi pemerintah untuk mengembangkan inovasi pelayanan publik berbasis digital</p>',
    aksi: ''
  },
  {
    no: 2,
    judul: 'Model Inovasi Pelayanan Publik Bidang Penanganan Stunting',
    gambar: 'https://jippnas.menpan.go.id/storage/images/modelinov//4cXkNJ2R5mbW9FXA.jpg',
    file: 'Tersedia',
    keterangan: '<p>Penanganan stunting di Indonesia memerlukan pendekatan yang holistik dan terintegrasi, salah satunya dengan mengembangkan model inovasi pelayanan publik yang mencakup tiga komponen utama: manajemen data, edukasi, dan pendampingan. Ketiga komponen ini saling mendukung dalam menciptakan ekosistem kebijakan yang berkelanjutan dan efektif. Manajemen Data berfungsi sebagai tulang punggung dalam penanganan stunting. Edukasi bertujuan untuk meningkatkan kesadaran masyarakat mengenai pentingnya gizi, pola asuh yang baik, serta sanitasi yang sehat. Pendampingan berperan dalam memastikan bahwa setiap keluarga mendapatkan bimbingan langsung terkait pemberian asupan gizi tambahan dan akses layanan kesehatan.</p>',
    aksi: ''
  },
  {
    no: 3,
    judul: 'Model Inovasi Pelayanan Publik Bidang Pengendalian Inflasi',
    gambar: 'https://jippnas.menpan.go.id/storage/images/modelinov//E7yzA2aljYJOSjvs.jpg',
    file: 'Tersedia',
    keterangan: '<p>Inovasi-inovasi yang diterapkan di berbagai daerah di Indonesia menunjukkan potensi besar dalam pengendalian inflasi dan peningkatan kesejahteraan masyarakat. Inovasi-inovasi tersebut mencakup tiga tahap utama dalam pengendalian inflasi: <strong>produksi</strong>, yang melibatkan optimalisasi sumber daya dan kapasitas produksi melalui kolaborasi antara petani dan kelompok tani, serta pengendalian hama dan penyediaan benih berkualitas; <strong>panen</strong>, yang memanfaatkan sistem penyimpanan untuk menunda penjualan hingga harga lebih menguntungkan serta program yang memberikan harga adil bagi petani; dan <strong>penjualan</strong>, di mana pemanfaatan pasar murah dan penjualan langsung oleh KUD mengurangi peran tengkulak, menjaga harga tetap stabil, serta memastikan kesejahteraan konsumen.</p>',
    aksi: ''
  },
  {
    no: 4,
    judul: 'Model Inovasi Pelayanan Publik Bidang Pengentasan Kemiskinan',
    gambar: 'https://jippnas.menpan.go.id/storage/images/modelinov//Rx7sX4oMHUubKeO3.jpg',
    file: 'Tersedia',
    keterangan: '<p>Bentuk pembelajaran dari inovasi pelayanan publik terkait intervensi program pengentasan kemiskinan ekstrim melalui aspek tata kelola dan pemberdayaan masyarakat. Model inovasi ini merupakan sebuah model pengentasan kemiskinan dengan metode intervensi sekuensial yang terdiri dari perbaikan data, pemberian bantuan sosial, perbaikan lingkungan, penyediaan akses terhadap sumber daya ekonomi, dan pemberdayaan ekonomi</p>',
    aksi: ''
  },
  {
    no: 5,
    judul: 'Model Inovasi Pelayanan Publik Bidang Peningkatan Investasi',
    gambar: 'https://jippnas.menpan.go.id/storage/images/modelinov/5/pCTV5pu4ib9Z706W.jpg',
    file: 'Tersedia',
    keterangan: '<p>Bentuk pembelajaran dari inovasi pelayanan publik terkait upaya peningkatan investasi melalui penguatan aspek tata kelola <i>(governance).</i> Inovasi pelayanan publik bidang peningkatan investasi dilakukan dalam tataran Perencanaan dan Penganggaran, Bisnis Proses, Sumber Daya Manusia, Teknologi Informasi, dan Pengawasan. <i>Able People</i> dan <i>agile process</i> menjadi pendorong utama tata kelola inovasi dalam sistem sosial sebagai upaya meningkatkan investasi. Penerimaan inovasi dalam sistem sosial memperhatikan atribut <i>relative advantage, compatibility, complexity, triability,</i> dan <i>observability.</i></p>',
    aksi: ''
  },
  {
    no: 6,
    judul: 'Model Inovasi Pelayanan Publik Bidang Peningkatan Penggunaan Produk Dalam Negeri (P3DN)',
    gambar: 'https://jippnas.menpan.go.id/storage/images/modelinov//XcDlYiFI6W0vVaRP.jpg',
    file: 'Tersedia',
    keterangan: '<p>Model inovasi pelayanan publik dalam bidang Peningkatan Penggunaan Produk Dalam Negeri (P3DN) yang ditawarkan adalah Model PDCA (<i>Plan-Do-Check-Act</i>) yang dikombinasikan dengan Blok Kanvas sebagai alat bantu dalam mengidentifikasi hal-hal penting yang perlu dianalisis dan dielaborasi oleh inovator. Model ini dirancang untuk membantu para pelaku usaha dalam mengembangkan inovasi secara berkelanjutan dengan mempertimbangkan faktor eksternal yang berpengaruh terhadap keberhasilan inovasi mereka. Model ini diharapkan dapat mendorong para pelaku usaha dan inovator untuk lebih proaktif dalam mengembangkan dan memperbarui inovasi mereka, sehingga dapat mendukung pencapaian tujuan penguatan P3DN secara lebih efektif dan berkelanjutan.</p>',
    aksi: ''
  }
]

const editItem = (item) => {
  console.log('Edit item', item.judul)
}

const deleteItem = (item) => {
  console.log('Delete item', item.judul)
}
</script>