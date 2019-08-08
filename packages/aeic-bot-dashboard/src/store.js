import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import router from './router'

Vue.use(Vuex)

const defaultState = () => JSON.parse(JSON.stringify({
  token: null,
  discordUser: {
    username: null,
    discriminator: null,
    id: null,
    avatar: null,
    roles: null
  }
}))

export default new Vuex.Store({
  state: defaultState(),

  actions: {},

  mutations: {
    setLoggedIn(state, { token, discordUser }) {
      state.token = token
      state.discordUser = discordUser
    },
    setLoggedOut(state) {
      const getDefault = defaultState()
      state.token = getDefault.token
      state.discordUser = getDefault.discordUser
      router.push({ name: 'Home' })
    },
    setRolesList(state, rolesList) {
      if (!state.discordUser) return
      state.discordUser.roles = rolesList
    }
  },

  getters: {
    isLoggedIn(state) {
      return !!state.token
    },
    discordFullPseudo(state) {
      return `${state.discordUser.username}#${state.discordUser.discriminator}`
    }
  },

  plugins: [createPersistedState({ key: 'aeic-bot2-dashboard' })]
})
