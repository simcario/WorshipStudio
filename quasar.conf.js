// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'i18n',
      'axios',
      'default'
    ],

    css: [
      'app.styl'
    ],

    extras: [
      // 'ionicons-v4',
      // 'mdi-v3',
       'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    framework: {
      // iconSet: 'ionicons-v4',
      // lang: 'de', // Quasar language

      // all: true, // --- includes everything; for dev only!

      components: [
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QPageSticky',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QBtnToggle',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QFab',
        'QFabAction',
        'QDialog',
        'QBar',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QSpace',
        'QExpansionItem',
        'QInput',
        'QTooltip',
        'QBtnDropdown',
        'QList',
        'QItem',
        'QSeparator',
        'QStepper',
        'QStep',
        'QStepperNavigation',
        'QBtnToggle',
        'QAvatar',
        'QSpace',
        'QChip',
        'QSlideItem',
        'QBanner',
        'QMenu',
        'QSelect',
        'QTab',
        'QTabs',
        'QTabPanel',
        'QTabPanels',
        'QInnerLoading',
        'QSpinnerGears',
        'QSpinnerBars',
        'QBadge',
        'QDate',
        'QPopupProxy',
        'QToggle',
        'QColor',
        'QFooter',
        'QBtnGroup',
        'QTree',
        'QScrollArea'
      ],

      directives: [
        'Ripple',
        'ClosePopup',
        'TouchRepeat'
      ],

      // Quasar plugins
      plugins: [
        'Notify',
        'Meta'
      ]
    },

    supportIE: false,

    build: {
      scopeHoisting: true,
      distDir: './dist-electron',
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'WorshipStudio Client',
        // short_name: 'WorshipStudio Client',
        // description: 'Worship Application for Musicians, Singers and Worship Leaders',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.worshipstudio.client.app',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    electron: {
       bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

         appId: 'worshipstudio',
         "win": {
          "target": "nsis",
          "icon": "src/statics/icons/icon_256.ico",
          "publish": ["github"],
          "publisherName": "${author.name}"
        },
        "nsis": {
          "artifactName": "${productName}.${version}.${ext}"
        },
      
      }
    }
  }
}
