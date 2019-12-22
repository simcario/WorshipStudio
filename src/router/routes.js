
const routes = [
  {
    path: '/',
    component: () => import('layouts/Home.vue')
  },
  {
    path: '/lib',
    component: () => import('../components/Library.vue'),
    children: [
    
    ]
  },
  {
    path: '/slide',
    component: () => import('pages/SlideWindow.vue'),
    children: [
    
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
    path: '/ViewEditSong/:songid/:edit',
    component: () => import('layouts/Blank.vue'),
    children: [
      { path: '', component: () => import('pages/ViewEditSong.vue') }
    ]
  },
  {
    path: '/Vertical',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Vertical.vue') }
    ]
  },
  {
    path: '/RenewLicense',
    component: () => import('layouts/Blank.vue'),
    children: [
      { path: '', component: () => import('pages/RenewLicense.vue') }
    ]
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
