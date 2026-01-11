<template>
  <InovasiTerkini />
  <InovasiStats />
  <InovasiUnggulan />
</template>

<script setup>
import InovasiStats from '~/components/InovasiStats.vue'
import InovasiUnggulan from '~/components/InovasiUnggulan.vue'
import InovasiTerkini from '~/components/InovasiTerkini.vue'

useHead({
  title: 'JIPPNAS - Jaringan Inovasi Pelayanan Publik Nasional',
  meta: [
    {
      name: 'description',
      content: 'JIPPNAS adalah portal Jaringan Inovasi Pelayanan Publik Nasional yang dikembangkan oleh Kementerian PANRB untuk mendukung dan mempromosikan inovasi pelayanan publik di seluruh Indonesia.'
    },
    {
      name: 'keywords',
      content: 'JIPPNAS, Jaringan Inovasi Pelayanan Publik, Kementerian PANRB, Inovasi Pelayanan Publik, Reformasi Birokrasi'
    },
    {
      property: 'og:title',
      content: 'JIPPNAS - Jaringan Inovasi Pelayanan Publik Nasional'
    },
    {
      property: 'og:description',
      content: 'JIPPNAS adalah portal Jaringan Inovasi Pelayanan Publik Nasional yang dikembangkan oleh Kementerian PANRB untuk mendukung dan mempromosikan inovasi pelayanan publik di seluruh Indonesia.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'JIPPNAS - Jaringan Inovasi Pelayanan Publik Nasional'
    },
    {
      name: 'twitter:description',
      content: 'JIPPNAS adalah portal Jaringan Inovasi Pelayanan Publik Nasional yang dikembangkan oleh Kementerian PANRB untuk mendukung dan mempromosikan inovasi pelayanan publik di seluruh Indonesia.'
    }
  ]
})
</script>