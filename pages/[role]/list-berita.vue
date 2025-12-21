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
import { ref } from 'vue'

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
  { title: 'No', key: 'no' },
  { title: 'Judul', key: 'judul' },
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

const beritaData = ref([
  {
    no: 1,
    judul: 'Telemedicine #SayDOC (SAtu laYar ngobrol dengan DOCter)',
    deskripsi: 'RSUD Prof. Dr. Margono (RSMS) merupakan RS milik Prov. Jawa Tengah Klas B Pendidikan. Rata-rata kunjungan pasien rawat jalan 1.054 pasien/hari (2019) dengan rata-rata pasien kronis (jantung, paru, bedah saraf, dalam, jiwa) sebesar 278 pasien/hari (2019).\nBerdasarkan laporan evaluasi pelayanan di RSUD Prof. Dr. Margono Soekarjo (RSMS) tahun 2019 ditemukan permasalahan belum adanya akses rawat jalan melalui daring, metode pembayaran masih menggunakan metode cash sehingga perlu disiapkan dengan metode transfer ke virtual akun rekening bank sebagai pembayaran yang sah, banyaknya pasien antri untuk pengambilan obat di loket farmasi rawat jalan berpotensi penularan covid-19, cakupan pasien kronis menurun sebesar 7% pada awal pandemi covid-19.\nCovid-19 ditetapkan menjadi pandemi oleh WHO pada Maret 2020. Selaras dengan SE Gubernur Jateng 440/0006405 tentang Antisipasi Risiko Penularan Covid, RSMS menetapkan kebijakan berupa terobosan inovasi pencegahan penyebaran Covid-19. Inisiasi inovasi Telemedicine #SayDOC (Satu Layar Ngobrol dengan Dokter) dikembangkan April 2020 dan dilaunching Mei 2020, mempermudah akses pelayanan kesehatan rawat jalan. Masyarakat yang membutuhkan pelayanan rawat jalan dilakukan dari rumah. Pelayanan terapi obat pasien rawat jalan juga tetap berjalan sesuai dengan diagnosa paska Telemedicine antara pasien dengan dokter melalui video call WhatsApp.\nHasil evaluasi sesudah inovasi tahun 2020 diantaranya: (1) mempermudah akses pelayanan rawat jalan secara online Telemedicine #SayDOC, (2) mempermudah metode pembayaran dengan metode transfer via virtual akun bank (Mandiri, BNI, Visa, Mastercard); (3) pengambilan obat melalui hantaran obat se-Indonesia atau diambil di apotek kerja sama; (4)meningkatkan cakupan pelayanan pasien kronis (Awal pandemi menurun 7%(Mar-2020), setelah inovasi meningkat 24%(Mar-2021) dari cakupan bulan sebelumnya).\nInovasi berdampak kepada:\n\nmasyarakat/pasien: mendapatkan kemudahan akses pelayanan rawat jalan secara daring dan kepastian layanan dan terhindar dari risiko penularan covid-19;\nManajemen RSMS: berupa total quality control pelayanan rumah sakit dan sumber daya lain yang mendukung pelayanan yang menjamin validitas pelayanan dan akuntabilitas;\nPemerintah Provinsi Jawa Tengah: Kepercayaan masyarakat meningkat',
    tag: 'umum',
    img: 'storage/images/berita/16/p9Gl58OGiYdDiEEhXbYWL2XWIHZbwYlpzRYjr9tT.jpg',
    action: ''
  },
  {
    no: 2,
    judul: 'Rapat Tindak Lanjut Penyederhanaan Layanan Kepegawaian dengan BKN',
    deskripsi: 'Sekretaris Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (PANRB) Rini Widyantini memimpin rapat dengan Badan Kepegawaian Negara (BKN), secara virtual, Jumat (02/12). Rapat tersebut membahas tindak lanjut akselerasi penyederhanaan tiga l',
    tag: 'indonesia maju',
    img: 'storage/images/berita/3/tpf9SNMM7Luprsu1bboEzHUlRMIrbSP38eGBcAW7.jpg',
    action: ''
  },
  {
    no: 3,
    judul: 'Rapat Penetapan Rancangan Perpres Kementerian Hukum dan HAM',
    deskripsi: 'Deputi Bidang Kelembagaan dan Tata Laksana Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (PANRB) Nanik Murwati mengikuti rapat bersama Kementerian Sekretariat Negara, secara virtual, Kamis (01/12). Rapat membahas penetapan Rancangan Pe',
    tag: 'ham indonesia',
    img: 'storage/images/berita/5/W3Nc494BZwWnfzzbiGd7JvxkicvlMG6auDbT6lBB.jpg',
    action: ''
  },
  {
    no: 4,
    judul: 'Rapat Penataan Organisasi Lembaga Administrasi Negara',
    deskripsi: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (PANRB) menggelar rapat penataan organisasi Lembaga Administrasi Negara (LAN) di Jakarta, Kamis (01/12). Rapat ini dipimpin oleh Deputi Bidang Kelembagaan dan Tata Laksana Kementerian PANRB',
    tag: 'untuk anda',
    img: 'storage/images/berita/6/KmHDodcw3u24uv3DZRzYHW9WrtybiXQBsKV3JjhY.jpg',
    action: ''
  },
  {
    no: 5,
    judul: 'Pacu Reformasi Birokrasi Berdampak, Kementerian PANRB Lakukan Pembinaan Inovasi Pelayanan Publik',
    deskripsi: 'BALI – Pemerintah daerah terus dipacu untuk menerapkan reformasi birokrasi yang berdampak langsung ke masyarakat, salah satunya melalui pengembangan inovasi pelayanan publik. Untuk mengakselerasi hal tersebut, Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (PANRB) menggelar Seminar Pembinaan Inovasi Pelayanan Publik.\n\nAdapun, tujuan diadakannya kegiatan seminar untuk berbagi pengetahuan terkait pembinaan inovasi pelayanan publik. Seminar ini mengangkat tema \'Arah Pembinaan Inovasi Pelayanan Publik Menuju Birokrasi Berdampak\'. Kegiatan ini juga merupakan program Kementerian PANRB dalam pemberdayaan Hub Jaringan Inovasi Pelayanan Publik (JIPP) di Pemerintahan Daerah dalam mendorong penyelenggara pelayanan publik melalui inovasi,” ujar Deputi Bidang Pelayanan Publik Kementerian PANRB Diah Natalisa, di Bali, Kamis (02/11).\n\nBali menjadi lokasi pelaksanaan seminar dikarenakan pemerintah daerah di Bali selama ini cukup aktif dalam mengikuti Kompetisi Inovasi Pelayanan Publik (KIPP) yang diselenggarakan Kementerian PANRB. Lebih lanjut Diah menjelaskan bahwa KIPP merupakan salah satu upaya strategi untuk penciptaan inovasi pelayanan publik.\n\n"Sejak pertama kali diselenggarakan pada tahun 2014, KIPP telah berhasil menjaring 1.065 Top Inovasi Pelayanan Publik. Sebanyak 42 Inovasi diantaranya berasal dari wilayah Provinsi Bali yang tersebar di pemerintahan kabupaten/kota," tutur Diah.\n\nPenciptaan inovasi juga merupakan arahan Menteri PANRB Abdullah Azwar Anas yang sering digaungkan. Namun, perlu ditegaskan meskipun penciptaan inovasi pelayanan publik tersebut membawa dampak positif ke masyarakat tapi bukan berarti pemerintah daerah berlomba membuat aplikasi yang baru.\n\nSelain penciptaan inovasi, Kementerian PANRB juga melakukan pembinaan inovasi pelayanan publik melalui pengembangan dan pelembagaan inovasi pelayanan publik. Menurutnya pengembangan inovasi bukan hanya untuk meng-upgrade cara kerja inovasi, namun juga memperluas jangkauan dampak ke unit kerja lain, instansi lain, atau bahkan daerah lain di Indonesia.\n\nDiah berharap, melalui ketiga aspek pembinaan ini dapat tercipta ekosistem yang sehat yang dapat mendorong reformasi birokrasi berdampak. Namun, tidak bisa dipungkiri bahwa setelah sepuluh tahun program pembinaan inovasi pelayanan publik, masih ada tantangan yang perlu direspons secara positif untuk melakukan perbaikan.\n\nSalah satu kendala yang dihadapi adalah belum meratanya pertumbuhan inovasi pelayanan publik yang sesuai dengan kriteria inovasi. Hal ini dapat dilihat dari sebaran Top Inovasi Pelayanan Publik yang didominasi oleh instansi pemerintah yang terkonsentrasi di Pulau Jawa.\n\nTerdapat keengganan untuk melakukan replikasi inovasi karena dianggap sebagai tindakan yang tidak kreatif, tidak orisinil, dan memiliki konotasi negatif menjadi salah satu penyebab tidak meratanya pertumbuhan inovasi pelayanan publik di daerah.\n\nSebagai penyelenggara pelayanan publik, Kementerian PANRB perlu melihat dan melutuskan kembali bahwa replikasi sangat penting karena merupakan bagian dari penyebarluasan inovasi. Replikasi juga dapat menghadirkan pelayanan publik yang berkualitas karena inovasi yang direplikasi sudah teruji di daerah lain. Oleh karena itu pemerintah harus mampu memahami kebutuhan apakah lebih strategis menciptakan inovasi atau mereplikasi suatu inovasi.\n\nBaik penciptaan inovasi maupun replikasi diharapkan memenuhi kebutuhan dan tuntutan masyarakat atas pelayanan publik yang lebih baik. Pemerintah daerah harus bisa menempatkan kebutuhan dan pengambilan kebijakan dalam penciptaan maupun replikasi inovasi pelayanan publik,” imbuh Diah.\n\nHadir sebagai pembicara dalam seminar tersebut, Asisten Perekonomian dan Pembangunan Sekretariat Daerah Provinsi Bali I Wayan Serinah; Ketua Tim Panel Independen KIPP 2023 Siti Zuhro; serta Ketua Tim Evaluasi KIPP 2023 IB Wyasa Putra.\n\nDengan mengangkat tema Prospektif Pengembangan Hub JIPP di Provinsi Bali I Wayan Serinah menyampaikan bahwa di Provinsi Bali sudah dilaksanakan replikasi dari beberapa inovasi di sebagian daerah. Replikasi inovasi yang akan diimplementasikan di wilayah pemerintahan provinsi, kabupaten, atau kota di Bali dilaksanakan sesuai kebutuhan pada setiap instansi daerah pada masing-masing Organisasi Perangkat Daerah (OPD).\n\nSelanjutnya, Ida Bagus selaku Ketua Tim Evaluasi KIPP 2023 memaparkan mengenai bagaimana membangun Inovasi pelayanan publik berkelanjutan. Menurutnya, inovasi yang baik adalah inovasi yang dapat berkelanjutan, salah satunya bisa dikembangkan melalui replikasi.\n\nDisampaikan juga bahwa diperlukan dukungan dari berbagai pihak, terutama dari pemerintah untuk membangun dan menjaga keberlangsungan inovasi. Dukungan yang dibutuhkan adalah infrastruktur dan anggaran. Infrastruktur sendiri dapat berupa regulasi yang bisa menjamin keberlangsungan inovasi.\n\nSedangkan Siti Zuhro menyampaikan bahwa masing-masing institusi memiliki fungsi untuk mendorong keberhasilan inovasi pelayanan publik. "Tantangan besarnya adalah political will, political commitment, dan law enforcement yang acapkali berubah," pungkasnya. (fik/HUMAS MENPANRB)',
    tag: '#InovasiPelayananPublik',
    img: 'storage/images/berita/9/gYn3Cg4JGomPHILrZK5zZIfEOcpAyVRkDPtuA6n4.jpg',
    action: ''
  },
  {
    no: 6,
    judul: 'Optimalkan Layanan Publik untuk WNI, Kementerian PANRB Tinjau KBRI Wellington',
    deskripsi: 'WELLINGTON - Upaya mewujudkan pelayanan publik yang berkualitas dan berdampak tidak hanya ditujukan bagi warga negara Indonesia (WNI) di dalam negeri, tetapi juga di luar negeri. Memastikan hal itu, Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (PANRB) meninjau sejumlah layanan di Kedutaan Besar Republik Indonesia (KBRI) di Wellington, Selandia Baru, Senin (06/11).  Dalam kunjungan ini, Plt. Asisten Deputi Standarisasi Pelayanan Publik dan Pelayanan Inklusif Kementerian PANRB Noviana Andrina, beserta perwakilan KBRI Wellington yang diwakili oleh Koordinator Fungsi Penerangan dan Sosial Budaya Tumpal M.H. Hutagalung, dan Koordinator Fungsi Protokol dan Konsuler Reza Reflusmen, Jr berdiskusi tentang penyelenggaraan pelayanan KBRI yang meliputi pelayanan paspor, pelayanan visa, legalisasi, surat keterangan, dan pelayanan lainnya.  Disampaikan ada beberapa aspek yang harus dipenuhi untuk memberikan pelayanan yang optimal bagi masyarakat. "Untuk menghadirkan pelayanan publik berkualitas dan sesuai harapan masyarakat, penyelenggara pelayanan perlu memenuhi beberapa aspek penting diantaranya aspek kebijakan pelayanan atau standar pelayanan, aspek profesional sumber daya manusia, aspek sarana dan prasarana, aspek sistem informasi pelayanan publik, aspek konsultasi dan pengelolaan pengaduan, dan aspek inovasi pelayanan publik", ungkap Noviana.  Lebih lanjut Noviana mengingatkan, penyelenggaraan pelayanan juga perlu memperhatikan masyarakat kelompok rentan seperti lansia, anak-anak, perempuan hamil, penyandang disabilitas, dan korban bencana alam dan bencana sosial. "Ruang pelayanan perlu disesuaikan untuk memberikan kenyamanan aksesibilitas yang penuh bagi setiap warga yang dilayani, seperti adanya ramp (jalur landai), toilet khusus disabilitas, alat bantu mobilitas, dan fasilitas yang mendukung kenyamanan pelayanan bagi setiap warga negara", imbuhnya.  20231106 KBRI Wellington 4  Sebagai informasi, gedung KBRI Wellington yang sudah berusia kurang lebih 115 tahun tersebut memerlukan beberapa penyesuaian dalam penyediaan sarana dan prasarana yang lebih aksesibel dan ramah kelompok rentan. Namun, perlu dilakukan pemenuhan beberapa persyaratan yang diberikan oleh pihak pemerintah setempat, yaitu Wellington City Council untuk dapat melakukan penyesuaian terhadap bangunan yang merupakan cagar budaya tersebut.  Melalui ketiga aspek pembinaan ini, Kementerian PANRB akan mendukung penuh upaya optimalisasi layanan KBRI Wellington, salah satu nya dengan membuat rekomendasi untuk mendorong peningkatan sarana dan prasarana gedung pelayanan KBRI Wellington di Selandia Baru.  Untuk diketahui, KBRI Wellington, yang juga merangkap Samoa, Kerajaan Tonga, Kepulauan Cook, dan Niue, melayani kurang lebih 6.500 WNI. Koordinator Fungsi Protokol dan Konsuler KBRI Wellington Reza Reflusmen menyampaikan, dalam memberikan pelayanan, KBRI juga melakukan inovasi pelayanan berupa layanan jemput bola dimana layanan tidak hanya dibuka di Kota Wellington, tetapi juga di kota-kota lainnya seperti di Auckland, Christchurch, dan bahkan di Kepulauan Pasifik.  20231106 KBRI Wellington 5  Reza menambahkan, bahwa upaya menghadirkan layanan yang optimal diperlukan dukungan perupa peningkatan kapasitas dan jumlah sumber daya manusia serta peralatanan pelayanan yang memadai. Selain layanan jemput bola, KBRI Wellington juga berupaya mengoptimalkan layanan publik digital yang memungkinkan pelayanan dapat menjangkau warga negara yang berada di seluruh wilayah cakupannya.  Salah satunya dengan SMS Gateway untuk memberikan berbagai informasi yang berkaitan dengan berbagai fungsi pelayanan khususnya terkait perlindungan warga negara Indonesia. SMS Gateway dipandang sebagai salah satu media informasi yang dapat diandalkan dan dapat menjangkau seluruh warga negara di seluruh wilayah cakupan KBRI Wellington.  Melalui SMS Gateway, KBRI Wellington dapat mengirimkan berbagai informasi penting dengan akurat dan terpercaya, seperti informasi lapor diri, survei kepuasan masyarakat, informasi jadwal layanan jemput bola, dan lainnya. "Salah satu inovasi yang dikembangkan dan cukup efektif adalah pemanfaatan SMS Gateway, karena masyarakat disini masih lebih banyak menggunakan media SMS untuk mendapatkan informasi yang tidak bersifat pribadi", pungkas Reza. (fik/HUMAS MENPANRB)',
    tag: '#untuk anda',
    img: 'storage/images/berita/8/aNGBYTMh6yoKRA9FbzpjyHkE70T5nGBxIcSOHOfq.jpg',
    action: ''
  },
  {
    no: 7,
    judul: 'Lepas Ekspor Tuna dan Pemberian Bantuan untuk Nelayan Biak Numfor',
    deskripsi: 'Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (PANRB) Abdullah Azwar Anas mendampingi Wakil Presiden RI K.H Ma\'ruf Amin mengunjungi Pelabuhan Pelindo, Kabupaten Biak Numfor, Jumat (02/12). Kunjungan yang juga dihadiri Menteri Kelautan dan',
    tag: 'Ekspor',
    img: 'storage/images/berita/4/Fcw2rwQZz7siiHQfAnZwZdAFVzCAnOFnk7QfmYPJ.jpg',
    action: ''
  },
  {
    no: 8,
    judul: 'Kementerian PANRB Akan Serahkan Anugerah Pelayanan Publik, Luncurkan JIPPNas, dan Resmikan 12 MPP',
    deskripsi: 'JAKARTA – Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (PANRB) akan memberikan penghargaan anugerah pelayanan publik 2023 kepada instansi pemerintah. Dijadwalkan, Menteri PANRB Abdullah Azwar Anas didampingi Deputi Bidang Pelayanan Publik Kementerian PANRB Diah Natalisa akan memberikan penghargaan tersebut pada Selasa, 21 November 2023, di Jakarta.\n\nPenganugerahan pelayanan publik akan diberikan atas hasil evaluasi kinerja unit penyelenggara pelayanan publik (UPP), penyedia sarana dan prasarana ramah kelompok rentan, serta penyelenggara MPP terbaik. Selain itu, Menteri Anas juga akan menyerahkan penghargaan kepada Top Inovasi Pelayanan Publik Terpuji yang terdiri dari Top 45 Inovasi Kelompok Umum dan 5 pemenang Outstanding Achievement of Public Service Innovation yang terjaring di Kompetisi Inovasi Pelayanan Publik 2023.\n\n"Untuk mendorong persaingan positif antar instansi, Kementerian PANRB melakukan pemantauan, evaluasi, dan juga kompetisi," ujar Diah, di Jakarta, Senin (20/11).\n\nPenyelenggaraan KIPP Tahun 2023 sangat spesial karena bertepatan dengan momentum 10 tahun gerakan One Agency One Innovation dan KIPP yang pertama kali dilaksanakan pada tahun 2014. Penerima penghargaan Top Inovasi Pelayanan Publik Terpuji Tahun 2023 tidak hanya berasal dari Kementerian/Lembaga dan Pemerintah Daerah, tetapi juga dari BUMN dan BUMD.\n\nLebih lanjut Diah menjelaskan bahwa berbeda dengan tahun sebelumnya, pelaksanaan Pemantauan dan Evaluasi Kinerja Penyelenggara Pelayanan Publik (PEKPPP) tahun ini dilakukan secara mandiri oleh kementerian, lembaga, dan pemerintah daerah pada ruang lingkup administrasi, barang, dan jasa. Hal tersebut dilakukan, agar setiap instansi pemerintah dan BUMN juga dapat berbenah dan menggunakan instrumen ini untuk mengukur kinerja layanan pada lingkupnya.\n\nSementara dalam pelaksanaan monitoring dan evaluasi (monev) MPP, Diah menyampaikan bahwa monev ini juga bertujuan untuk melihat aspek-aspek sejauh mana dampak kehadiran MPP dalam mendukung investasi di kabupaten dan kota yang memiliki MPP, serta mendapatkan informasi terkait kepuasan masyarakat terhadap kehadiran MPP dan kelengkapan layanan sesuai dengan kebutuhan masyarakat. Dijelaskan, sistem monev ini menggabungkan konsep Balanced Scorecard dan konsep Servqual.\n\nDalam kesempatan itu, sebanyak 12 pemerintah daerah juga akan meresmikan MPP secara serentak. Diantaranya yaitu Kabupaten Bengkalis, Kota Lubuklinggau, Kabupaten Muara Enim, Kabupaten Tangerang, Kabupaten Magelang, Kabupaten Jember, Kabupaten Bangkalan, Kabupaten Pamekasan, Kabupaten Sintang, Kabupaten Banggai, Kabupaten Polewali Mandar, serta Kabupaten Ngada. Peresmian tersebut akan menambah jumlah MPP yang tersebar di Indonesia yakni 175 MPP.\n\n"Besok, kita juga akan menyaksikan peresmian sebanyak 12 MPP secara serentak, sehingga dengan demikian telah terbentuk sebanyak 175 MPP yang tersebar di seluruh Indonesia," imbuh Diah.\n\nKementerian PANRB selaku pembina pelayanan publik juga terus memastikan reformasi berdampak yang langsung bisa dirasakan masyarakat, salah satunya melalui inovasi pelayanan publik. Inovasi dibutuhkan untuk merespon perubahan lingkungan strategis yang cenderung dinamis. Dimana pelayanan publik perlu melakukan penyesuaian ke arah yang lebih cepat, tepat, efektif, efisien dan fleksibel yang dapat memberikan warna baru dalam pelayanan publik tersebut. Sebagai bentuk pengembangan inovasi dan dalam rangka untuk mengakselerasi pelayanan publik yang lebih baik, direncanakan Menteri Anas juga akan meluncurkan platform Jaringan Inovasi Pelayanan Publik Nasional (JIPPNas).\n\nJIPPNas hadir sebagai knowledge management system yang juga menjadi basis data inovasi pelayanan publik nasional. "Website JIPPNas akan menampilkan 2.928 data inovasi yang berasal dari Kompetisi Inovasi Pelayanan Publik (KIPP) Kementerian PANRB, Innovative Government Award (IGA) Kemendagri dan Laboratorium Inovasi (InoLAN) LAN, diharapkan JIPPNAS menjadi rujukan nasional terkait praktik Terbaik Inovasi Pelayanan Publik Nasional," ungkap Diah.\n\nMasyarakat juga dapat menyaksikan langsung kegiatan ini melalui kanal Youtube Kementerian PANRB pada pukul 09.00 WIB. (fik/HUMAS MENPANRB)',
    tag: 'umum',
    img: 'storage/images/berita/10/n5HW5iRX0Lyol6IhSmqp55G0VAFu3x6DWdfvA3XG.jpg',
    action: ''
  },
  {
    no: 9,
    judul: 'Anugerah Layanan Investasi 2023',
    deskripsi: 'Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (PANRB) Abdullah Azwar Anas bersama Menteri Investasi/Kepala BKPM Bahlil Lahadalia mendampingi Wakil Presiden Republik Indonesia Ma\'ruf Amin pada Anugerah Layanan Investasi (ALI) 2023 di Jakarta, Rabu (08/11).  ALI merupakan pemberian penghargaan kepada pemda dan kementerian/lembaga yang memperoleh hasil penilaian terbaik atas kinerja layanan investasi yang ditetapkan melalui Keputusan Menteri Investasi/Kepala BKPM. Penghargaan ini diberikan pada 12 instansi pemerintah kategori kementerian/lembaga, pemda, dan penghargaan khusus kawasan timur Indonesia.  Dalam kegiatan tersebut Wapres Ma\'ruf Amin mengatakan peningkatan realisasi investasi sebagai salah satu tema utama Reformasi birokrasi. Investasi vital untuk menopang pembangunan berkelanjutan.  Penghargaan tersebut juga dihadiri oleh Menteri Perhubungan Budi Karya Sumadi. Pada kesempatan tersebut Menteri PANRB didampingi Plh Deputi Pelayanan Publik Kementerian PANRB Ajib Rakhmawanto dan Staf Khusus Menteri PANRB Bidang Inovasi Pemerintahan Eri Irawan.',
    tag: '#Investasi',
    img: 'storage/images/berita/7/guTGR5dj7FtWgiAktpoTy6qN2VncWq1Lq6n6PGQj.jpg',
    action: ''
  }
])

function editBerita(item) {
  isEditing.value = true
  beritaForm.value = { ...item }
  showAddDialog.value = true
}

function deleteBerita(item) {
  if (confirm('Hapus berita "' + item.judul + '"?')) {
    beritaData.value = beritaData.value.filter(b => b.no !== item.no)
  }
}

function saveBerita() {
  saving.value = true
  try {
    if (isEditing.value) {
      const index = beritaData.value.findIndex(b => b.no === beritaForm.value.no)
      if (index !== -1) {
        beritaData.value[index] = { ...beritaForm.value }
      }
    } else {
      const newBerita = {
        ...beritaForm.value,
        no: Date.now()
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