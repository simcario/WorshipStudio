
const routes = [
  {
    path: '/',
    component: () => import('layouts/Home.vue')
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
    path: '/Slides',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Slides.vue') }
    ]
  },
  {
    path: '/Chords',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Chords.vue') }
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
