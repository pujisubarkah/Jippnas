<template>
  <div class="bg-white">
    <div class="container mx-auto px-4 py-8">
      <!-- Title and Description -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-primary mb-4">Etalase Inovasi</h1>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Selamat datang di Etalase Inovasi JIPPNAS. Di sini Anda dapat menjelajahi berbagai inovasi yang telah dikembangkan oleh para inovator di Indonesia.
        </p>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <!-- Left Column: SDGs -->
        <div class="lg:col-span-4">
          <Sdgs />
        </div>

        <!-- Right Column: Daftar Instansi and Innovation Cards -->
        <div class="lg:col-span-8">
          <!-- Daftar Instansi -->
          <div class="mb-8">
            <DaftarInstansi />
          </div>

          <!-- Innovation Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Placeholder cards for innovations -->
            <div class="bg-gray-50 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow" style="padding: 2rem;">
              <h3 class="text-xl font-semibold text-gray-800" style="margin-bottom: 1rem;">E-Samsat Mobile</h3>
              <p class="text-gray-600" style="margin-bottom: 1rem; line-height: 1.6;">Aplikasi pembayaran pajak kendaraan bermotor secara online yang memudahkan masyarakat tanpa harus datang ke kantor Samsat.</p>
              <p class="text-sm text-gray-400 italic">Ini adalah data dummy, bukan sebenarnya</p>
            </div>
            <div class="bg-gray-50 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow" style="padding: 2rem;">
              <h3 class="text-xl font-semibold text-gray-800" style="margin-bottom: 1rem;">Si Cantik (Sistem Cerdas Antrian Terpadu Klinik)</h3>
              <p class="text-gray-600" style="margin-bottom: 1rem; line-height: 1.6;">Sistem antrian digital berbasis aplikasi untuk pelayanan kesehatan yang mengurangi waktu tunggu dan meningkatkan efisiensi layanan.</p>
              <p class="text-sm text-gray-400 italic">Ini adalah data dummy, bukan sebenarnya</p>
            </div>
            <div class="bg-gray-50 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow" style="padding: 2rem;">
              <h3 class="text-xl font-semibold text-gray-800" style="margin-bottom: 1rem;">Portal Satu Data Pendidikan</h3>
              <p class="text-gray-600" style="margin-bottom: 1rem; line-height: 1.6;">Platform integrasi data pendidikan nasional yang menyediakan informasi terpadu tentang siswa, guru, sekolah, dan sarana prasarana pendidikan.</p>
              <p class="text-sm text-gray-400 italic">Ini adalah data dummy, bukan sebenarnya</p>
            </div>
            <div class="bg-gray-50 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow" style="padding: 2rem;">
              <h3 class="text-xl font-semibold text-gray-800" style="margin-bottom: 1rem;">Smart Village Dashboard</h3>
              <p class="text-gray-600" style="margin-bottom: 1rem; line-height: 1.6;">Dashboard monitoring pembangunan desa berbasis data real-time untuk transparansi pengelolaan dana desa dan pelaporan kinerja desa.</p>
              <p class="text-sm text-gray-400 italic">Ini adalah data dummy, bukan sebenarnya</p>
            </div>
            <div class="bg-gray-50 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow" style="padding: 2rem;">
              <h3 class="text-xl font-semibold text-gray-800" style="margin-bottom: 1rem;">e-Posyandu Integrated</h3>
              <p class="text-gray-600" style="margin-bottom: 1rem; line-height: 1.6;">Sistem informasi posyandu digital untuk pencatatan dan monitoring kesehatan ibu, bayi, dan balita dengan fitur reminder jadwal imunisasi.</p>
              <p class="text-sm text-gray-400 italic">Ini adalah data dummy, bukan sebenarnya</p>
            </div>
            <div class="bg-gray-50 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow" style="padding: 2rem;">
              <h3 class="text-xl font-semibold text-gray-800" style="margin-bottom: 1rem;">Sistem Perizinan Online Terpadu</h3>
              <p class="text-gray-600" style="margin-bottom: 1rem; line-height: 1.6;">Platform one-stop service untuk berbagai jenis perizinan usaha dan non-usaha dengan proses approval yang transparan dan cepat.</p>
              <p class="text-sm text-gray-400 italic">Ini adalah data dummy, bukan sebenarnya</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Inovasi Unggulan at the bottom -->
    <InovasiUnggulan />
  </div>
</template>

<script setup>
import InovasiUnggulan from '~/components/InovasiUnggulan.vue';
import Sdgs from '~/components/Sdgs.client';
import DaftarInstansi from '~/components/daftar_instansi.vue';

useHead({
  title: 'Etalase Inovasi | JIPPNAS - Jaringan Inovasi Pelayanan Publik Nasional',
  meta: [
    {
      name: 'description',
      content: 'Jelajahi berbagai inovasi pelayanan publik yang telah dikembangkan oleh instansi pemerintah di seluruh Indonesia melalui JIPPNAS.'
    }
  ]
})
</script>