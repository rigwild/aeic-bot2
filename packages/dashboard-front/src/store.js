import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { defaultTpGroupsName, defaultYearGroupsName, defaultAssoGroupsName } from '@aeic-bot2/bot/dist/database/initDb'

import router from './router'
import { API_CALL_SHORT } from './utils'

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
      const { token, discordUser } = await API_CALL_SHORT(`/login/discordCallback/${code}`)
      commit('setLoggedIn', token)
      commit('setDiscordUser', discordUser)
    },

    async refreshDiscordUser({ commit }) {
      const discordUser = await API_CALL_SHORT('/dashboard/discordUser')
      commit('setDiscordUser', discordUser)
    },

    async setYearGroup({ commit }, yearGroup) {
      const res = await API_CALL_SHORT('/dashboard/discordUser/yearGroup', { yearGroup }, 'PATCH')
      commit('setRolesList', res.rolesList)
      return res
    },

    async setTpGroup({ commit }, tpGroup) {
      const res = await API_CALL_SHORT('/dashboard/discordUser/tpGroup', { tpGroup }, 'PATCH')
      commit('setRolesList', res.rolesList)
      return res
    },

    async setAssoGroup({ commit }, assoGroup) {
      const res = await API_CALL_SHORT('/dashboard/discordUser/assoGroup', { assoGroup }, 'PATCH')
      commit('setRolesList', res.rolesList)
      return res
    }
  },

  mutations: {
    setLoggedIn(state, token) {
      state.token = token
    },
    setDiscordUser(state, discordUser) {
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
    },

    currentTpGroup(state) {
      if (!state.discordUser.roles) return
      return state.discordUser.roles.find(x => defaultTpGroupsName.includes(x))
    },
    currentYearGroup(state) {
      if (!state.discordUser.roles) return
      return state.discordUser.roles.find(x => defaultYearGroupsName.includes(x))
    },
    currentAssoGroup(state) {
      if (!state.discordUser.roles) return
      return state.discordUser.roles.find(x => defaultAssoGroupsName.includes(x))
    }
  },

  plugins: [createPersistedState({ key: 'aeic-bot2-dashboard' })]
})
