import Vue from 'vue'
import Router from 'vue-router'

import store from './store'
import Home from './views/Home.vue'

Vue.use(Router)

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    needLoggedIn: false,
    needLoggedOut: true
  },
  {
    path: '/discordCallback',
    name: 'DiscordCallback',
    component: () => import('./views/DiscordCallback.vue'),
    props: true,
    needLoggedIn: false,
    needLoggedOut: false
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./views/Dashboard.vue'),
    needLoggedIn: true,
    needLoggedOut: false
  }
]

const router = new Router({ routes })

router.beforeEach((to, from, next) => {
  const needLoggedIn = routes.filter(x => x.needLoggedIn).map(x => x.name)
  const needLoggedOut = routes.filter(x => x.needLoggedOut).map(x => x.name)

  // Redirect to login page if user is not logged in and want to go to a login-need page
  if (store.getters.isLoggedIn && needLoggedOut.includes(to.name))
    return next({ name: 'Dashboard' })

  // Redirect to home page if user is logged in and want to go to a no-login-need page
  if (!store.getters.isLoggedIn && needLoggedIn.includes(to.name))
    return next({ name: 'Home' })

  next()
})

export default router
