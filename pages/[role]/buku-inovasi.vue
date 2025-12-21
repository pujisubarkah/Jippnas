<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Buku Inovasi</h1>
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="bukuData"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.gambar="{ item }">
            <v-img :src="item.gambar" width="100" height="100" contain></v-img>
          </template>
          <template v-slot:item.sinopsis="{ item }">
            <div>{{ item.sinopsis }}</div>
          </template>
          <template v-slot:item.action="{ item }">
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
  { title: 'Sinopsis', key: 'sinopsis' },
  { title: 'File', key: 'file', width: '100px' },
  { title: 'Uploaded By', key: 'uploadedBy' },
  { title: 'Action', key: 'action', sortable: false, width: '100px' }
]

const bukuData = [
  {
    no: 1,
    judul: 'Top KIPP Tahun 2023',
    gambar: 'https://jippnas.menpan.go.id/storage/images/buku//TusZOGArhtiEvQJc.jpg',
    sinopsis: 'Buku Top Inovasi Pelayanan Publik Tahun 2023 merupakan dokumentasi dari sepuluh tahun pelaksanaan Kompetisi Inovasi Pelayanan Publik (KIPP) yang diselenggarakan oleh Kementerian PANRB. Kompetisi ini telah menjadi barometer bagi kementerian/lembaga, pemerintah daerah, dan BUMN dalam mendorong lahirnya inovasi pelayanan publik yang berdampak nyata. Sejalan dengan arahan Presiden dan Wakil Presiden Republik Indonesia, inovasi dalam pelayanan publik menjadi wujud konkret dari reformasi birokrasi yang tidak hanya administratif, namun berorientasi pada hasil yang dirasakan langsung oleh masyarakat. Buku ini menyajikan praktik-praktik inovatif dari berbagai instansi pemerintah yang telah melalui proses seleksi ketat dan terbukti memberikan manfaat. Diterbitkan dalam dua bahasa—Indonesia dan Inggris—buku ini diharapkan menjadi sumber pembelajaran dan inspirasi bagi pengambil kebijakan, praktisi pemerintahan, serta masyarakat luas, baik di dalam maupun luar negeri. Terbitnya buku ini menegaskan komitmen kuat untuk terus menumbuhkan budaya inovasi sebagai bagian penting dari transformasi birokrasi yang adaptif, responsif, dan berdampak.',
    file: 'File Tersedia',
    uploadedBy: 'Super Admin',
    action: ''
  },
  {
    no: 2,
    judul: 'Top KIPP Tahun 2022',
    gambar: 'https://jippnas.menpan.go.id/storage/images/buku//IIAy8b2xy3H9Y66e.jpg',
    sinopsis: 'Dalam rangka mendokumentasikan praktik terbaik dari inovasi yang menjadi Finalis Top Inovasi Pelayanan Publik Tahun 2022, disusunlah Buku Inovasi Pelayanan Publik Tahun 2022. Penyusunan ini merupakan bentuk perhatian dan dorongan terhadap upaya penciptaan inovasi pelayanan publik serta komitmen terhadap keberlanjutan dalam memelihara dan mengembangkan inovasi. Keberlanjutan inovasi memiliki peran penting dalam penyebarluasan pengetahuan inovasi sebagai bagian dari percepatan peningkatan kualitas pelayanan publik.',
    file: 'File Tersedia',
    uploadedBy: 'Super Admin',
    action: ''
  },
  {
    no: 3,
    judul: 'Top Kelompok Khusus 2020',
    gambar: 'https://jippnas.menpan.go.id/storage/images/buku//cpM3X4KJpidpbgNg.jpg',
    sinopsis: 'Buku ini berisi informasi mengenai inovasi pelayanan publik yang ditetapkan menjadi 15 Finalis Kelompok Khusus Kompetisi Inovasi Pelayanan Publik yang Berkelanjutan Tahun 2020, termasuk di dalamnya inovasi yang ditetapkan menjadi 5 Pemenang Outstanding Achievement of Public Service Innovation (OAPSI) 2020 yang ditandai dengan warna dan logo khusus 5 Pemenang OAPSI 2020',
    file: 'File Tersedia',
    uploadedBy: 'Super Admin',
    action: ''
  },
  {
    no: 4,
    judul: 'Top 99 Tahun 2020',
    gambar: 'https://jippnas.menpan.go.id/storage/images/buku//sBh2Bp6ABSVd3NdS.jpg',
    sinopsis: 'Penyelenggaraan Kompetisi Inovasi Pelayanan Publik (KIPP) oleh Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi dilakukan sejak Tahun 2014. Penyelenggaraan kompetisi ini dilaksanakan setia  tahun dan tahun 2020 ini merupakan yang ke-7 kalinya. Kegiatan tahunan yang dilaksanakan secara konsisten dan berkelanjutan membuktikan bahwa inovasi pelayanan publik merupakan ukuran sekaligus hasil dari upaya percepatan peningkatan kualitas pelayanan publik.',
    file: 'File Tersedia',
    uploadedBy: 'Super Admin',
    action: ''
  },
  {
    no: 5,
    judul: 'Top 99 Tahun 2019',
    gambar: 'https://jippnas.menpan.go.id/storage/images/buku/31/v8FMEz88ZMgXJorD.jpg',
    sinopsis: 'Kami mengharapkan buku ini menjadi inspirasi bagi seluruh penyelenggara pelayanan publik agar inovasi yang telah ada dapat direplikasi dan dimodifikasi. Selain itu, juga mendorong semangat kompetisi yang positif antarpenyelenggara layanan untuk berlomba-lomba dalam peningkatan kualitas pelayanan publik',
    file: 'File Tersedia',
    uploadedBy: 'Super Admin',
    action: ''
  },
  {
    no: 6,
    judul: 'Top 99 Tahun 2018',
    gambar: 'https://jippnas.menpan.go.id/storage/images/buku//oGZzerBXGiv52BsO.jpg',
    sinopsis: 'Penetapan Top 99 Inovasi Pelayanan Publik Tahun 2018 selain sebagai bentuk penghargaan kepada inovator, juga sebagai best practices bagi penyelenggara yang lain agar komitmen untuk meningkatkan kualitas pelayanan publik dapat terus menular secara masiv. Hal ini demi mencapai tujuan program One Agency One Innovation yang diharapkan dapat menimbulkan dampak luas bagi percepatan reformasi birokrasi',
    file: 'File Tersedia',
    uploadedBy: 'Super Admin',
    action: ''
  },
  {
    no: 7,
    judul: 'Top 99 Tahun 2017',
    gambar: 'https://jippnas.menpan.go.id/storage/images/buku//wWo1DAtIVKoAwKKv.jpg',
    sinopsis: 'Penerbitan buku ini merupakan bagian dari perjalanan yang cukup panjang dalam ajang Kompetisi Inovasi Pelayanan Publik Tahun 2017. Mereka yang terpilih menjadi Top 99 Inovasi Pelayanan Publik merupakan inovasi yang terpilih dari 3.054 yang mendaftar secara online dalam registrasi Sistem Informasi Inovasi Pelayanan Publik (Sinovik) yang diproses melalui seleksi administrasi, evaluasi proposal Tim Evaluasi dan reviu dari Tim Panel Independen.',
    file: 'File Tersedia',
    uploadedBy: 'Super Admin',
    action: ''
  },
  {
    no: 8,
    judul: 'Top 99 Tahun 2016',
    gambar: 'https://jippnas.menpan.go.id/storage/images/buku//c78ubLGthfWE19xA.jpg',
    sinopsis: 'Kompetisi ini mengacu pada Peraturan Menteri PANRB Nomor 30 Tahun 2014 tentang Pedoman Inovasi Pelayanan Publik dan Peraturan Menteri PANRB Nomor 15 Tahun 2015 tentang Kompetisi Inovasi Pelayanan Publik Tahun 2016 di lingkungan Kementerian, Lembaga, Pemerintah Provinsi, Pemerintah Kabupaten, Pemerintah Kota, dan BUMN. Tahun 2016 merupakan tahun pertama bagi kepesertaan dari BUMN',
    file: 'File Tersedia',
    uploadedBy: 'Super Admin',
    action: ''
  },
  {
    no: 9,
    judul: 'Top 99 KIPP Tahun 2015',
    gambar: 'https://jippnas.menpan.go.id/storage/images/buku//4afqypAMSKpQGvpi.jpg',
    sinopsis: 'Buku ini berisi 99 inovasi pelayanan publik 2015 terbaik yang dilaksanakan oleh Kementerian/Lembaga, Pemerintah Provinsi, Pemerintah Kabupaten, dan Pemerintah Kota Tahun 2015. Inovasi pelayanan publik mengacu pada Peraturan Menteri PANRB Nomor 30 Tahun 2014 tentang Pedoman Inovasi Pelayanan Publik dan Surat Edaran Menteri PANRB Nomor 09 Tahun 2014 tentang Kompetisi Inovasi Pelayanan Publik Tahun 2015 di lingkungan Kementerian/Lembaga dan Pemerintah Daerah.',
    file: 'File Tersedia',
    uploadedBy: 'Super Admin',
    action: ''
  },
  {
    no: 10,
    judul: 'Top 99 KIPP Tahun 2014',
    gambar: 'https://jippnas.menpan.go.id/storage/images/buku//Y6QLfj6XWpcTYKwZ.jpg',
    sinopsis: 'Buku ini tidak sekedar menyampaikan succes story inovasi Kementerian/Lembaga dan Pemerintah Daerah, namun lebih dari itu untuk menggugah setiap aparatur pemerintah berlomba-lomba melakukan inovasi untuk kemajuan pelayanan publik di lingkungannya masing-masing. Hal ini juga sesuai dengan tujuan kompetisi inovasi pelayanan publik, yaitu menjadikan inovasi sebagai sarana pembelajaran dan mendorong tumbuhnya modifikasi atau inovasi baru pelayanan publik',
    file: 'File Tersedia',
    uploadedBy: 'Super Admin',
    action: ''
  }
]

const editItem = (item) => {
  console.log('Edit item', item.judul)
}

const deleteItem = (item) => {
  console.log('Delete item', item.judul)
}
</script>