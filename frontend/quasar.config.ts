// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app'

export default defineConfig(() => {
  return {
    // Boot files
    boot: [],

    // CSS
    css: [
      'app.css'
    ],

    // Quasar extras
    extras: [
      'roboto-font',
      'material-icons'
    ],

    // Build configuration
    build: {
      target: {},

      typescript: {
        strict: true,
        vueShim: true
      },

      vueRouterMode: 'hash'
    },

    // Development server
    devServer: {
      open: true,

      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },

    // Quasar framework
    framework: {
      config: {},

      plugins: [
        'Notify'
      ]
    },

    // Animations
    animations: [],

    // Server-Side Rendering
    ssr: {
      prodPort: 3000,

      middlewares: [
        'render'
      ]
    },

    // Static Site Generation
    ssg: {},

    // Progressive Web App
    pwa: {
      workboxMode: 'GenerateSW'
    },

    // Cordova
    cordova: {},

    // Capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Electron
    electron: {
      preloadScripts: [
        'electron-preload'
      ],

      inspectPort: 5858,

      bundler: 'packager',

      packager: {},

      builder: {
        appId: 'frontend'
      }
    },

    // Browser Extension
    bex: {
      extraScripts: []
    }
  }
})