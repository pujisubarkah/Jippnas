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
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'sidebar'
})

const headers = [
  { title: 'ID', key: 'id', width: '50px' },
  { title: 'Judul', key: 'judul' },
  { title: 'Gambar', key: 'gambar', width: '120px' },
  { title: 'File', key: 'file', width: '80px' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Aksi', key: 'aksi', sortable: false, width: '100px' }
]


import { ref, onMounted } from 'vue'
const modelData = ref([])
onMounted(async () => {
  const response = await $fetch('/api/master-inovasi')
  modelData.value = response?.data || []
})

const editItem = (item) => {
  console.log('Edit item', item.judul)
}

const deleteItem = (item) => {
  console.log('Delete item', item.judul)
}
</script>