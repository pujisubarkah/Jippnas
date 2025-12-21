<script setup>
definePageMeta({
  layout: 'sidebar'
})

const search = ref('')

const breadcrumbItems = [
  {
    title: 'Daftar Tautan Terkait',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Tautan', key: 'tautan' },
  { title: 'Action', key: 'actions', sortable: false, width: '150px' }
]

const tautanData = ref([
  {
    no: 1,
    nama: 'web menpan testing',
    tautan: 'https://menpan.go.id'
  },
  {
    no: 2,
    nama: 'testing web sinovik',
    tautan: 'https://sinovik.menpan.go.id'
  },
  {
    no: 3,
    nama: 'LAPOR!',
    tautan: 'https://www.lapor.go.id/'
  }
])

const editItem = (item) => {
  console.log('Edit item', item.nama)
}

const deleteItem = (item) => {
  console.log('Delete item', item.nama)
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Tautan Terkait</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" href="https://jippnas.menpan.go.id/dashboard/tautan/form">
          Tambah Tautan
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Tautan"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="tautanData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.tautan="{ item }">
            <a :href="item.tautan" target="_blank">{{ item.tautan }}</a>
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
