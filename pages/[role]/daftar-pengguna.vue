<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Daftar Pengguna</h1>

    <v-card>
      <v-card-header>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="addUser">
          Tambah Pengguna
        </v-btn>
      </v-card-header>

      <v-card-text>
        <v-text-field
          v-model="search"
          label="Masukkan kalimat kunci"
          class="mb-4"
        ></v-text-field>

        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.status === 'Aktif' ? 'success' : 'error'"
              size="small"
            >
              {{ item.status || 'Non Aktif' }}
            </v-chip>
          </template>

          <template v-slot:item.action="{ item }">
            <div class="d-flex gap-2">
              <v-btn
                icon
                color="primary"
                size="small"
                @click="editUser(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                color="warning"
                size="small"
                @click="changePassword(item)"
              >
                <v-icon>mdi-lock</v-icon>
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
  { title: 'No', key: 'no', width: '18px' },
  { title: 'Nama', key: 'nama', width: '212px' },
  { title: 'Instansi', key: 'instansi', width: '84px' },
  { title: 'UPP', key: 'upp', width: '196px' },
  { title: 'Username', key: 'username', width: '72px' },
  { title: 'Email', key: 'email', width: '194px' },
  { title: 'No. Telpon', key: 'no_telpon', width: '87px' },
  { title: 'Role', key: 'role', width: '34px' },
  { title: 'Status', key: 'status', width: '138px' },
  { title: 'PKRI', key: 'pkri', width: '31px' },
  { title: 'Gagal Login', key: 'gagal_login', width: '37px' },
  { title: 'Last Online', key: 'last_online', width: '40px' },
  { title: 'Action', key: 'action', width: '200px' }
]

const items = ref([
  {
    no: 1,
    nama: 'Super Admin',
    instansi: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    upp: 'Direktorat Pelayanan Publik',
    username: '',
    email: 'super_admin@jippnas.go.id',
    no_telpon: '',
    role: 'Super Admin',
    status: 'Non Aktif',
    pkri: 'N',
    gagal_login: '3',
    last_online: '2025-12-23 21:55:58',
    edit_url: 'https://jippnas.menpan.go.id/dashboard/user/form/1',
    change_pass_url: 'https://jippnas.menpan.go.id/dashboard/user/setup_changePass/1'
  },
  {
    no: 2,
    nama: 'Admin Upp',
    instansi: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Indonesia',
    upp: '',
    username: '',
    email: 'admin_upp@jippnas.com',
    no_telpon: '',
    role: 'Admin Upp',
    status: 'Aktif',
    pkri: 'N',
    gagal_login: '',
    last_online: '',
    edit_url: 'https://jippnas.menpan.go.id/dashboard/user/form/4',
    change_pass_url: 'https://jippnas.menpan.go.id/dashboard/user/setup_changePass/4'
  },
  {
    no: 3,
    nama: 'Admin Pusat',
    instansi: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Indonesia',
    upp: '',
    username: '',
    email: 'admin_pusat@jippnas.com',
    no_telpon: '',
    role: 'Admin Pembina',
    status: 'Aktif',
    pkri: 'N',
    gagal_login: '',
    last_online: '2024-06-01 01:23:39',
    edit_url: 'https://jippnas.menpan.go.id/dashboard/user/form/5',
    change_pass_url: 'https://jippnas.menpan.go.id/dashboard/user/setup_changePass/5'
  },
  {
    no: 4,
    nama: 'Admin  LAN',
    instansi: 'Lembaga Administrasi Negara',
    upp: 'Direktorat Pelayanan Publik',
    username: 'admin.lan',
    email: 'admin_lan@jippnas.go.id',
    no_telpon: '',
    role: 'Admin Pembina',
    status: 'Aktif',
    pkri: 'N',
    gagal_login: '0',
    last_online: '2025-12-22 15:39:23',
    edit_url: 'https://jippnas.menpan.go.id/dashboard/user/form/34',
    change_pass_url: 'https://jippnas.menpan.go.id/dashboard/user/setup_changePass/34'
  },
  {
    no: 5,
    nama: 'Admin Kemendagri',
    instansi: 'Kementerian Dalam Negeri Indonesia',
    upp: 'Direktorat Pelayanan Publik',
    username: '',
    email: 'admin_kemendagri@jippnas.go.id',
    no_telpon: '0811111111341',
    role: 'Admin Pembina',
    status: 'Aktif',
    pkri: 'N',
    gagal_login: '',
    last_online: '',
    edit_url: 'https://jippnas.menpan.go.id/dashboard/user/form/41',
    change_pass_url: 'https://jippnas.menpan.go.id/dashboard/user/setup_changePass/41'
  },
  {
    no: 6,
    nama: 'Admin Pemrov DKI Jakarta',
    instansi: 'Pemerintah Provinsi Dki jakarta',
    upp: 'Dinas Kesehatan',
    username: '',
    email: 'admin_pemrovdki@jippnas.go.id',
    no_telpon: '0895321205212',
    role: 'Admin Pembina',
    status: '',
    pkri: 'N',
    gagal_login: '',
    last_online: '2023-11-10 17:17:13',
    edit_url: 'https://jippnas.menpan.go.id/dashboard/user/form/42',
    change_pass_url: 'https://jippnas.menpan.go.id/dashboard/user/setup_changePass/42'
  },
  {
    no: 7,
    nama: 'Pemerintahan Kota Administrasi Jakarta Timur',
    instansi: 'Pemerintah Kota adm. jakarta timur',
    upp: 'Direktorat Pelayanan Publik',
    username: '',
    email: 'admin_jkt_tim@jippnas.go.id',
    no_telpon: '0895321205222',
    role: 'Admin Instansi',
    status: 'Aktif',
    pkri: 'N',
    gagal_login: '',
    last_online: '',
    edit_url: 'https://jippnas.menpan.go.id/dashboard/user/form/43',
    change_pass_url: 'https://jippnas.menpan.go.id/dashboard/user/setup_changePass/43'
  },
  {
    no: 8,
    nama: 'Dinkes PemKot Jakarta Timur',
    instansi: 'Pemerintah Kota adm. jakarta timur',
    upp: 'Dinas Kesehatan',
    username: '',
    email: 'dinkes_jaktim@jippnas.go.id',
    no_telpon: '0895321205233',
    role: 'Admin Upp',
    status: 'Aktif',
    pkri: 'N',
    gagal_login: '',
    last_online: '2025-10-13 08:37:10',
    edit_url: 'https://jippnas.menpan.go.id/dashboard/user/form/45',
    change_pass_url: 'https://jippnas.menpan.go.id/dashboard/user/setup_changePass/45'
  },
  {
    no: 9,
    nama: 'ahmads',
    instansi: 'Pemerintah Aceh',
    upp: 'Rumah Sakit Umum Daerah dr. Zainoel Abidin Aceh',
    username: 'ahmad.dinkes',
    email: 'adsadlad@gmail.com',
    no_telpon: '0895321205222',
    role: 'Admin Upp',
    status: 'Non Aktif',
    pkri: 'N',
    gagal_login: '3',
    last_online: '',
    edit_url: 'https://jippnas.menpan.go.id/dashboard/user/form/46',
    change_pass_url: 'https://jippnas.menpan.go.id/dashboard/user/setup_changePass/46'
  },
  {
    no: 10,
    nama: 'Testing - resty adelia',
    instansi: 'Pemerintah Provinsi Sumatera selatan',
    upp: 'Dinas Kesehatan',
    username: '',
    email: 'restyfauzinatadiharja@gmail.com',
    no_telpon: '0813300825820',
    role: 'Admin Instansi',
    status: 'Non Aktif',
    pkri: 'N',
    gagal_login: '3',
    last_online: '2025-05-26 14:06:46',
    edit_url: 'https://jippnas.menpan.go.id/dashboard/user/form/47',
    change_pass_url: 'https://jippnas.menpan.go.id/dashboard/user/setup_changePass/47'
  }
])

const addUser = () => {
  window.open('https://jippnas.menpan.go.id/dashboard/user/form', '_blank')
}

const editUser = (item) => {
  window.open(item.edit_url, '_blank')
}

const changePassword = (item) => {
  window.open(item.change_pass_url, '_blank')
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