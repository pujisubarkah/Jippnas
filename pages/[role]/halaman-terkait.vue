<script setup>
import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'sidebar'
})

const search = ref('')
const rawTautanData = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const loading = ref(true)

// Form data
const form = ref({
  nama: '',
  tautan: ''
})

const breadcrumbItems = [
  {
    title: $t('pages.relatedLinks.list'),
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: $t('pages.relatedLinks.name'), key: 'nama' },
  { title: $t('pages.relatedLinks.link'), key: 'tautan' },
  { title: $t('pages.relatedLinks.actions'), key: 'actions', sortable: false }
]

const tautanData = computed(() => {
  return rawTautanData.value.map((item, index) => ({
    ...item,
    no: index + 1
  }))
})

const fetchTautan = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/tautan')
    if (response.success) {
      rawTautanData.value = response.data
    } else {
      console.error('Failed to fetch tautan:', response.error)
      toast.error($t('pages.relatedLinks.loadError'))
    }
  } catch (error) {
    console.error('Error fetching tautan:', error)
    toast.error($t('pages.relatedLinks.loadError'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTautan()
})

// Modal functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    nama: '',
    tautan: ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    nama: '',
    tautan: ''
  }
}

const editItem = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    nama: item.nama,
    tautan: item.tautan
  }
  showModal.value = true
}

const saveTautan = async () => {
  try {
    if (!form.value.nama.trim() || !form.value.tautan.trim()) {
      toast.warning($t('pages.relatedLinks.validationError'))
      return
    }

    let response
    if (isEditing.value) {
      // Update existing tautan
      response = await $fetch(`/api/tautan/${editingId.value}`, {
        method: 'PUT',
        body: {
          nama: form.value.nama.trim(),
          tautan: form.value.tautan.trim()
        }
      })
    } else {
      // Create new tautan
      response = await $fetch('/api/tautan', {
        method: 'POST',
        body: {
          nama: form.value.nama.trim(),
          tautan: form.value.tautan.trim()
        }
      })
    }

    if (response.success) {
      await fetchTautan() // Refresh data
      closeModal()
      toast.success(`Tautan berhasil ${isEditing.value ? 'diupdate' : 'ditambahkan'}`)
    }
  } catch (error) {
    console.error('Error saving tautan:', error)
    toast.error(`Gagal ${isEditing.value ? 'mengupdate' : 'menyimpan'} tautan`)
  }
}

const deleteItem = async (item) => {
  if (confirm(`Apakah Anda yakin ingin menghapus "${item.nama}"?`)) {
    try {
      const response = await $fetch(`/api/tautan/${item.id}`, {
        method: 'DELETE'
      })
      if (response.success) {
        await fetchTautan() // Refresh data
        toast.success('Tautan berhasil dihapus')
      }
    } catch (error) {
      console.error('Error deleting tautan:', error)
      toast.error('Gagal menghapus tautan')
    }
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">{{ $t('pages.relatedLinks.title') }}</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          {{ $t('pages.relatedLinks.addNew') }}
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          :label="$t('search.placeholder')"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="tautanData"
          :search="search"
          :items-per-page="10"
          :loading="loading"
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

    <!-- Modal Tambah/Edit Tautan -->
    <v-dialog v-model="showModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? $t('pages.relatedLinks.editLink') : $t('pages.relatedLinks.addNew') }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveTautan" class="space-y-4">
            <v-text-field
              v-model="form.nama"
              :label="`${$t('pages.relatedLinks.name')} *`"
              required
              maxlength="255"
              variant="outlined"
              :placeholder="$t('pages.relatedLinks.name')"
            ></v-text-field>

            <v-text-field
              v-model="form.tautan"
              :label="`${$t('pages.relatedLinks.link')} *`"
              required
              type="url"
              variant="outlined"
              :placeholder="$t('pages.relatedLinks.link')"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal">{{ $t('pages.relatedLinks.cancel') }}</v-btn>
          <v-btn color="primary" @click="saveTautan">
            {{ isEditing ? $t('common.save') : $t('pages.relatedLinks.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>
