<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Footer</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-card-header>
      <v-card-text>
        <v-form @submit.prevent="saveFooter">
          <v-text-field
            v-model="footerData.alamat"
            label="Alamat"
            variant="outlined"
            class="mb-4"
          ></v-text-field>
          <v-text-field
            v-model="footerData.telepon"
            label="Telepon"
            variant="outlined"
            class="mb-4"
          ></v-text-field>
          <v-text-field
            v-model="footerData.email"
            label="Email"
            variant="outlined"
            class="mb-4"
          ></v-text-field>
          <v-textarea
            v-model="footerData.deskripsi"
            label="Deskripsi"
            variant="outlined"
            class="mb-4"
          ></v-textarea>
          <v-btn type="submit" color="primary">Simpan</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'sidebar'
})

const breadcrumbItems = [
  {
    title: 'Manajemen Footer',
    disabled: true,
  },
]

const footerData = ref({
  alamat: '',
  telepon: '',
  email: '',
  deskripsi: ''
})

function saveFooter() {
  // Implementasi simpan footer
  alert('Footer disimpan: ' + JSON.stringify(footerData.value))
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>