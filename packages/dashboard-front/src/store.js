import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import router from './router'
import { shortenCall as API_CALL, API_ROUTES } from './utils'

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

  actions: {
    async sendDiscordCallbackCode({ commit }, code) {
      const res = await API_CALL(API_ROUTES.discordCallback(code))
      commit('setLoggedIn', res)
    },

    async sendYearGroup({ commit }, yearGroup) {
      const res = await API_CALL(API_ROUTES.yearGroup, { yearGroup })
      commit('setRolesList', res.rolesList)
      return res
    },

    async sendAssoGroup({ commit }, assoGroup) {
      const res = await API_CALL(API_ROUTES.assoGroup, { assoGroup })
      commit('setRolesList', res.rolesList)
      return res
    }
  },

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
