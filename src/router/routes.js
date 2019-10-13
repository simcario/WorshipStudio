
const routes = [
  {
    path: '/',
    component: () => import('layouts/Home.vue')
  },
  {
    path: '/Mobile',
    component: () => import('layouts/Mobile.vue'),
    children: [
      { path: '', component: () => import('pages/mobile/MobileHome.vue') }
    ]
  },
  {
    path: '/Mobile/Settings',
    component: () => import('layouts/Mobile.vue'),
    children: [
      { path: '', component: () => import('pages/mobile/MobileSettings.vue') }
    ]
  },
  {
    path: '/Mobile/Playlist',
    component: () => import('layouts/Mobile.vue'),
    children: [
      { path: '', component: () => import('pages/mobile/MobilePlaylist.vue') }
    ]
  },
  {
    path: '/Mobile/Songlist',
    component: () => import('layouts/Mobile.vue'),
    children: [
      { path: '', component: () => import('pages/mobile/MobileSongList.vue') }
    ]
  },
  {
    path: '/Login',
    component: () => import('layouts/Blank.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ]
  },
  {
    path: '/Preferences',
    component: () => import('layouts/Blank.vue'),
    children: [
      { path: '', component: () => import('pages/Preferences.vue') }
    ]
  },
  {
    path: '/ChordsHome',
    component: () => import('layouts/ChordManager.vue'),
    children: [
      { path: '', component: () => import('pages/ChordsHome.vue') }
    ]
  },
  {
    path: '/LyricsHome',
    component: () => import('layouts/LyricsManager.vue'),
    children: [
      { path: '', component: () => import('pages/LyricsHome.vue') }
    ]
  },
  {
    path: '/slide',
    component: () => import('pages/Slide.vue'),
    children: [
     
    ]
  },
  {
    path: '/SlidesHome',
    component: () => import('layouts/SlideManager.vue'),
    children: [
      { path: '', component: () => import('pages/SlidesHome.vue') }
    ]
  },
  {
    path: '/RenewLicense',
    component: () => import('layouts/Blank.vue'),
    children: [
      { path: '', component: () => import('pages/RenewLicense.vue') }
    ]
  },
  {
    path: '/SetServer',
    component: () => import('layouts/Blank.vue'),
    children: [
      { path: '' ,component: () => import('pages/SetServer.vue') }
    ]
  },
  {
    path: '/FirstConfig',
    component: () => import('layouts/FirstConfig.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
