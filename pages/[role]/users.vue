<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 text-blue-700">Management User</h2>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Daftar Pengguna</h3>
        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" @click="showModal = true">
          Tambah User Baru
        </button>
      </div>
      <!-- Modal Tambah User Baru -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
          <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600" @click="showModal = false">&times;</button>
          <h4 class="text-lg font-bold mb-4">Tambah User Baru</h4>
          <form @submit.prevent="handleAddUser">
            <div class="mb-3">
              <label class="block text-sm font-medium mb-1">Username</label>
              <input v-model="form.username" type="text" class="w-full border rounded px-3 py-2" required />
            </div>
            <div class="mb-3">
              <label class="block text-sm font-medium mb-1">Email</label>
              <input v-model="form.email" type="email" class="w-full border rounded px-3 py-2" required />
            </div>
            <div class="mb-3">
              <label class="block text-sm font-medium mb-1">Password</label>
              <input v-model="form.password" type="password" class="w-full border rounded px-3 py-2" required />
            </div>
            <div class="mb-3">
              <label class="block text-sm font-medium mb-1">Role</label>
              <select v-model="form.role" class="w-full border rounded px-3 py-2" required>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Simpan</button>
          </form>
        </div>
      </div>
      <!-- Modal Edit User -->
      <div v-if="editModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
          <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600" @click="editModal = false">&times;</button>
          <h4 class="text-lg font-bold mb-4">Edit User</h4>
          <form @submit.prevent="handleEditUser">
            <div class="mb-3">
              <label class="block text-sm font-medium mb-1">Username</label>
              <input v-model="editForm.username" type="text" class="w-full border rounded px-3 py-2" required />
            </div>
            <div class="mb-3">
              <label class="block text-sm font-medium mb-1">Email</label>
              <input v-model="editForm.email" type="email" class="w-full border rounded px-3 py-2" required />
            </div>
            <div class="mb-3">
              <label class="block text-sm font-medium mb-1">Role</label>
              <select v-model="editForm.role" class="w-full border rounded px-3 py-2" required>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Update</button>
          </form>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Nama</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pending" class="border-t">
              <td colspan="5" class="px-4 py-2 text-center text-sm text-gray-500">Loading...</td>
            </tr>
            <tr v-else-if="error" class="border-t">
              <td colspan="5" class="px-4 py-2 text-center text-sm text-red-500">Error loading users: {{ error.message }}</td>
            </tr>
            <tr v-else-if="users.length === 0" class="border-t">
              <td colspan="5" class="px-4 py-2 text-center text-sm text-gray-500">No users found</td>
            </tr>
            <tr v-else v-for="user in users" :key="user.id" class="border-t">
              <td class="px-4 py-2 text-sm">{{ user.username }}</td>
              <td class="px-4 py-2 text-sm">{{ user.email }}</td>
              <td class="px-4 py-2 text-sm">
                <span :class="user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'" class="px-2 py-1 rounded text-xs font-semibold">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-4 py-2 text-sm">
                <span :class="user.is_verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-2 py-1 rounded text-xs font-semibold">
                  {{ user.is_verified ? 'Verified' : 'Unverified' }}
                </span>
              </td>
              <td class="px-4 py-2 text-sm">
                <button class="text-blue-600 hover:text-blue-800 mr-2" title="Edit" @click="handleEdit(user)">
                  <component :is="Edit" class="w-4 h-4" />
                </button>
                <button class="text-red-600 hover:text-red-800" title="Delete" @click="handleDelete(user.id)">
                  <component :is="Trash" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAsyncData } from 'nuxt/app'
definePageMeta({ layout: 'sidebar' })
import { Edit, Trash } from 'lucide-vue-next'

const { data, error, pending } = await useAsyncData('users', () => $fetch('/api/users'))
const users = ref([])

if (data.value && data.value.success) {
  users.value = data.value.data
}

// Modal logic
const showModal = ref(false)
const form = ref({
  username: '',
  email: '',
  password: '',
  role: 'user',
})

async function handleAddUser() {
  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: { ...form.value },
    })
    showModal.value = false
    form.value = { username: '', email: '', password: '', role: 'user' }
    window.location.reload()
  } catch (e) {
    alert('Gagal tambah user!')
  }
}

// Edit modal logic
const editModal = ref(false)
const editForm = ref({
  username: '',
  email: '',
  role: 'user',
})
const selectedUserId = ref(null)

function handleEdit(user) {
  selectedUserId.value = user.id
  editForm.value = {
    username: user.username,
    email: user.email,
    role: user.role,
  }
  editModal.value = true
}

async function handleEditUser() {
  try {
    await $fetch(`/api/users/${selectedUserId.value}`, {
      method: 'PUT',
      body: { ...editForm.value },
    })
    editModal.value = false
    window.location.reload()
  } catch (e) {
    alert('Gagal edit user!')
  }
}

async function handleDelete(id) {
  if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
    try {
      await $fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })
      window.location.reload()
    } catch (e) {
      alert('Gagal hapus user!')
    }
  }
}
</script>

<style scoped>
/* Custom styles for user management */
</style>