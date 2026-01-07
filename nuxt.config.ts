// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    ['@nuxtjs/i18n', {
      lazy: true,
      langDir: 'locales',
      defaultLocale: 'id',
      strategy: 'no_prefix', // penting biar konsisten

      locales: [
        { code: 'id', file: 'id.json', name: 'Indonesia' },
        { code: 'en', file: 'en.json', name: 'English' },
      ],
    }],
  ],
  build: {
    transpile: ['vue-simple-calendar', 'vuetify']
  },
  vite: {
    plugins: [
      vuetify({ autoImport: true }),
    ],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/apexcharts@3.41.0/dist/apexcharts.css'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/ol@10.7.0/ol.css'
        },
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        }
      ],
      script: [
        {
          src: 'https://accounts.google.com/gsi/client',
          async: true,
          defer: true
        },
        {
          innerHTML: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'id',
                includedLanguages: 'en,id',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
              }, 'google_translate_element');
            }
          `,
          type: 'text/javascript'
        }
      ]
    }
  }
})
