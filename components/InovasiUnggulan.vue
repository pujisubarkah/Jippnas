<template>
  <ClientOnly>
    <div class="our-courses bg-blue-100 py-8 shadow-lg rounded-lg mx-4 my-8">
      <div class="max-w-7xl mx-auto px-4">
        <div class="w-full">
          <div class="section-heading text-center mb-8">
            <h2 class="text-2xl font-bold text-blue-800">Inovasi Unggulan</h2>
          </div>
        </div>
        <div class="">
          <swiper
            :slides-per-view="3"
            :space-between="30"
            :navigation="true"
            :pagination="{ clickable: true }"
            :autoplay="{ delay: 3000 }"
            :loop="true"
            :breakpoints="{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }"
            class="owl-courses-item"
          >
            <swiper-slide v-for="(item, index) in innovations" :key="index">
              <div class="item bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img :src="item.image" :alt="item.title" class="w-full h-48 object-cover">
                <div class="p-4">
                  <h4 class="text-lg font-bold text-blue-800 mb-2 line-clamp-2">{{ item.title }}</h4>
                  <p class="text-gray-700 text-sm mb-4 line-clamp-4">{{ item.description }}</p>
                  <a :href="item.link" target="_blank" class="btn btn-sm btn-primary">Selengkapnya</a>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const innovations = [
  {
    title: 'TIM BUSER (TIM BUNTING SERENTAK)',
    image: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    description: `Swasembada daging sapi merupakan target pemerintah yang belum tercapai. Kebutuhan daging sapi nasional pada tahun 2020 mencapai 717.150 ton, sedangkan produksi daging sapi nasional sebesar 515.627 ton. Impor daging sapi sebesar 100.000 ton dan 500.000 ekor sapi bakalan atau setara dengan 112.055 ton daging sapi menjadi langkah pemerintah untuk memenuhi kebutuhan daging sapi nasional.

Pemerintah melakukan berbagai program strategis berkesinambungan yang didukung dengan program pemerintah daerah dalam mencapai target swasembada daging. Salah satu program strategis mencapai target swasembada daging, yakni UPSUS SIWAB/Upaya Khusus Sapi Indukan Wajib Bunting (tahun 2017-2020), yang dilanjutkan dengan SIKOMANDAN/Sapi Kerbau Komoditas Andalan Negeri (tahun 2020-sekarang), dengan target peningkatan jumlah akseptor inseminasi buatan dan angka kelahiran sapi potong nasional.

Dengan target pelaksanaan SIKOMANDAN terbesar se-Indonesia, Jawa Timur mampu berkontribusi sebesar 27,39% kebutuhan sapi potong nasional, sedangkan Pulau Madura berkontribusi sebesar 30% kebutuhan sapi potong di Jawa Timur. Dalam mendukung keberhasilan pelaksanaan program strategis nasional dan peningkatan mutu layanan SIKOMANDAN, pemerintah daerah, dalam hal ini Kabupaten Pamekasan, memiliki Inovasi TIM BUSER (Tim Bunting Serentak) pada tahun 2018.

Inovasi ini berbentuk pelayanan pemeriksaan kebuntingan dan inseminasi buatan pada tingkat petani/peternak. TIM BUSER bertujuan untuk menjaring sapi betina produktif agar dapat kawin serentak dan bunting serentak. Mekanisme pelayanannya, yakni dengan mengumpulkan sapi dalam satu titik lokasi desa binaan secara massal, melakukan pemeriksaan kebuntingan terhadap akseptor yang sudah di-IB lebih dari 2 bulan, menjaring akseptor baru, melakukan pelayanan kesehatan hewan dan penanganan gangguan reproduksi, pembinaan kelompok tani, pemberian bantuan mineral dan obat cacing secara gratis, serta pembinaan penerapan teknologi pakan dan limbah.

Keistimewaan dari inovasi ini yakni mengubah sistem pelayanan menjadi lebih efektif dan efisien. Petugas tidak lagi melakukan pelayanan dari kandang ke kandang, tetapi dapat dilakukan dengan mengumpulkan ternak dalam satu titik lokasi desa binaan secara massal dan serentak. Sementara itu, pelaksanaan Inovasi TIM BUSER dilengkapi dengan Standar Pelayanan, Standar Operasional Prosedur, Maklumat Pelayanan, dan Surat Keputusan Pengelolaan Pengaduan yang diperbarui secara berkala setiap tahun.

Beberapa upaya mempromosikan Inovasi TIM BUSER, yaitu dengan sosialisasi secara langsung kepada peternak dan dilakukan survei mandiri terkait pengetahuan peternak terkait inovasi ini, sekaligus untuk mengukur tingkat kepuasan masyarakat terhadap pelayanan petugas. Selain itu, dilakukan juga survei kepuasan masyarakat berbasis online menggunakan aplikasi Google Form. Hasil dari survei kepuasan masyarakat, baik survei mandiri maupun berbasis online, lantas direkap dan diakumulasi sebagai laporan kepuasan masyarakat setiap tahun.`,
    link: 'https://jippnas.menpan.go.id/inovasi/1304'
  },
  {
    title: 'Sistem Informasi Jabatan Provinsi Riau (SI-JABPRI)',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/295/img_1.png',
    description: `Kementerian PANRB mendorong Pemda mewujudkan organisasi tepat fungsi, proses, dan ukuran, mengingat organisasi bersifat dinamis, tidak sekedar membentuk struktur, tetapi juga melakukan perencanaan kebutuhan jabatan dan pegawai yang proporsional, efektif, dan efisien. Perencanaan kebutuhan jabatan dan pegawai dilakukan melalui penyusunan analisis jabatan (Anjab) dan analisis beban kerja (ABK) pada jabatan struktural, pelaksana maupun fungsional. Dalam manajemen ASN peran Biro Organisasi adalah melakukan perencanaan kebutuhan riil, rasional dan sistematis berdasarkan beban kerja disetiap unit kerja. Apabila terjadi kesalahan perencanaan kebutuhan, maka ikut rusaklah tahap pelaksanaan manajemen ASN lainnya, seperti tahap rekrutmen pegawai, mutasi, rotasi, pangkat dan jabatan, pengembangan karir, pola karir, penilaian kinerja, penggajian, tunjangan dan lain sebagainya. Akibat selanjutnya juga terjadi pemborosan anggaran pembayaran tunjangan pegawai yang menduduki jabatan yang tidak sesuai dengan uraian tugas unit organisasi. Hal ini terjadi karena perencanaan tidak didasari pada kebutuhan organisasi riil. Tahapan verifikasi data anjab dan ABK seringkali bermasalah, tidak sebanding dengan jumlah verifikator anjab Biro Organisasi sehingga tidak optimal hasilnya. Dokumen anjab membutuhkan ruang arsip yang besar, rentan kerusakan dan anggaran kertas yang mahal. Permasalahan diatas tentunya sudah teratasi dengan lahirnya Sistem Informasi Jabatan Provinsi Riau (SI-JABPRI). Sistem berbasis website untuk kemudahan penyusunan Anjab, ABK dan Evaluasi Jabatan secara elektronik, dilengkapi petunjuk penyusunan sehingga dapat menekan anggaran kegiatan dibanding metode questioner, melakukan wawancara langsung ke Organisasi Perangkat Daerah atau hingga mendatangkan para ahli dalam penyusunan. SI-JABPRI disetting memiliki performance yang baik dalam pengolahan data yang banyak, sangat user-friendly, berkecepatan tinggi, membuat pengguna tidak jenuh dan terganggu dengan loading data yang berkepanjangan. Informasi jabatan lainnya pada sistem ini yang sangat mendukung manajemen kepegawaian lain adalah informasi formasi, kualifikasi pendidikan dan kompetensi jabatan, kesenjangan jabatan, syarat jabatan, efisiensi jabatan, jumlah pemangku jabatan, jumlah kebutuhan jabatan, serta distribusi jabatan yang berbasis analisis jabatan dan ABK. Sistem ini telah menggunakan teknologi informasi terbaru, mempunyai tampilan menarik dan terintegrasi dengan sistem kepegawaian "SMART" yang menyajikan seluruh nama ASN sebagai pemangku jabatan, kemudian integrasi dengan e-Agenda untuk mengukur target kinerja ASN sebagai syarat pembayaran TPP. Sebuah gagasan inovasi harus layak (feasible) dan dapat dilaksanakan (implementable). SI-JABPRI juga telah melalui analisis kelayakan inovasi yaitu telah layak administrasi, layak sumber daya, layak secara teknis, dan layak secara regulasi. SI-JABPRI memiliki nilai keberlanjutan yang tinggi, penyusunan anjab mengikuti perubahan kelembagaan yang dinamis, sangat potensial direplikasi oleh provinsi lain dan kabupaten/kota di Indonesia, karena metode penyusunan dan output yang dihasilkan memiliki pedoman regulasi dan format yang sama di seluruh Indonesia.`,
    link: 'https://jippnas.menpan.go.id/inovasi/295'
  },
  {
    title: 'Pembangunan Pengelolaan Keuangan dengan Sistem Keuangan Desa (Siskeudes)',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/img_1/14/4KuYNihN1vXiX66DjLOgy16i7uC9ELmxxGOwrStk.jpg',
    description: `Aplikasi Sistem Keuangan Desa (Siskeudes) dikembangkan sebagai inovasi dan kontribusi Badan Pengawasan Keuangan dan Pembangunan dalam ranah keuangan dan pembangunan desa, melalui pengawalan proses perencanaan, penganggaran, penatausahaan, dan pelaporan keuangan secara eletronik. Aplikasi Siskeudes telah digunakan pada 62.400 dari 75.265 desa (82,91%). Aplikasi ini telah mendapatkan respon positif dari berbagai stakeholders. Mulai dari pemerintah desa, pemerintah daerah, dan kementerian/lembaga. Aplikasi Siskeudes membantu mewujudkan pengelolaan keuangan desa yang akuntabel. Sampai dengan akhir tahun Tahun 2022, jumlah desa yang pengelolaan keuangan desanya akuntabel dengan menggunakan aplikasi Siskeudes adalah sebanyak 35.801. Kebermanfaatan aplikasi ini juga ditunjukkan dengan adanya interoperabilitas data (bagi pakai data) antara aplikasi Siskeudes dengan aplikasi pemerintahan lain, yaitu: Aplikasi Konsolidasi Keuangan Desa pada Kemendagri; Aplikasi Monev DD pada Kemendesa PDTT; Aplikasi Sistem Informasi Terpadu Pengawasan Desa (Situwassa) pada BPKP dalam rangka pengawasan dan analisis keuangan desa; dan Aplikasi OMSPAN dan Teman Desa untuk pengelolaan alokasi kinerja dalam perhitungan dana desa tahun 2023 pada Kementerian Keuangan.`,
    link: 'https://jippnas.menpan.go.id/inovasi/14'
  },
  {
    title: 'BARIS DITEBAS ( BARISTA DISABILITAS TEROBOS STIGMA KETERBATASAN )',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/img_1/2853/bPnh4Hhknuqgj6CqDejFElnkE4G4APkaIOqx6jDv.png',
    description: `BARIS DITEBAS (Barista Disabilitas Terobos Stigma Keterbatasan adalah inovasi pelayanan publik yang inklusi sosial dari Sentra "Wyata Guna" Bandung. Barista bukan hanya orang yang "bertugas" untuk membuat kopi di kedai kopi, tetapi mereka adalah seniman. Barista adalah seseorang yang terlatih secara profesional, memiliki keahlian tinggi untuk meracik kopi dengan melibatkan berbagai campuran. Mendatangkan instruktur Barista disabilitas langsung dari Korea sebagai narasumber tamu, Pelatihan Barista angkatan pertama bagi penyandang disabilitas diresmikan pada tahun 2019 dengan Café More Wyata Guna yang didirikan pada tanggal 13 Desember 2019 sebagai laboratorium praktek bekerja sekaligus tempat penyaluran kerja lulusannya. Bekerja sama dengan Morning Glory Coffee Academy, sertifikasi barista dilakukan untuk melahirkan Barista profesional dan bersertifikasi. Berkolaborasi dengan PT. Nutrifood Indonesia untuk meningkatkan awarenessvcustomer, dan traffic customer, selain juga upaya Product Development untuk menciptakan menu-menu baru, tak lupa Pelatihan Service Excellent untuk para baristanya. Tahun 2020, Sentra Wyata Guna Bandung, meraih penghargaan sebagai Lembaga Disabilitas Kreatif dan Inovatif, lanjut Tahun 2021, melalui inovasinya meracik minuman siap seduh dalam kemasan, Cafe More Wyata Guna meraih penghargaan sebagai Produk millenial terbaik dan Tahun 2022, BARIS DITEBAS berhasil masuk menjadi nominasi Finalis Top Inovasi Pelayanan Publik Kompetisi Inovasi Pelayanan Publik di Lingkungan Kementerian/Lembaga, Pemerintah Daerah, BUMN dan BUMD.`,
    link: 'https://jippnas.menpan.go.id/inovasi/2853'
  },
  {
    title: 'PINTER MELATIH ANAK KOBRA (Pendidikan Karakter melalui Terapi Psikososial bagi Anak Korban Radikalisme)',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/img_1/2895/MP9i2zshtdOMWbPGUawOl6oNGfmqHgHkKkyjnk7Q.jpg',
    description: `Penanganan Anak Korban Radikalisme tentu memiliki kekhususan dan keunikannya masing-masing. Kategorisasi anak korban radikalisme yang kemudian ditangani di Sentra "Handayani" di Jakarta juga harus menjadi perhatian, karena akan berdampak pada pemberian intervensi yang tepat dan sesuai bagi mereka. Selain itu, penanganan harus cakap dalam menakar sejauh mana dan sedalam apa ideologi radikalisme yang dipahaminya. Penanganan anak korban radikalisme, kian kompleks karena harus melibatkan professional dan/atau Lembaga lainnya untuk memastikan permasalahannya teratasi. Kejelasan prosedur, tahapan, sistem dalam penanganan anak korban radikalisme menjadi penting, mengingat kompleksitas penanganannya. Selain itu, dalam Konvensi Perserikatan Bangsa-Bangsa (PBB) Hak Anak, telah secara jelas diterangkan bahwa semua tindakan dan keputusan menyangkut seorang anak harus dilakukan atas dasar kepentingan terbaik sang anak dan pemerintah bertanggung jawab memastikan semua hak yang dicantumkan di dalam Konvensi dilindungi dan dipenuhi untuk tiap anak. Oleh karena itu, dibutuhkan sebuah aturan atau tatanan prosedur yang jelas agar seluruh penanganan bagi anak korban radikalisme dapat mengacu pada persiapan masa depan yang lebih baik, terukur dan berbasis kepentingan terbaik bagi anak. Sehingga dibuatlah makalah inovasi perubahan dengan judul "Standar Operasional Prosedur (SOP) Penanganan Anak Korban Radikalisme di Sentra "Handayani" di Jakarta".`,
    link: 'https://jippnas.menpan.go.id/inovasi/2895'
  }
];
</script>

<style scoped>
.line-clamp-2 {
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-4 {
  line-clamp: 4;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>