<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link class="navbar-brand" to="/">aeic-bot2-dashboard</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li v-if="isLoggedIn" class="nav-item">
              <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
            </li>
          </ul>
          <ul class="navbar-nav ml-auto">
            <li v-if="!isLoggedIn" class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li v-if="isLoggedIn" class="nav-item pointer">
              <a class="nav-link" @click.prevent="setLoggedOut">({{ discordFullPseudo }}) - Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-2 mb-4">
      <router-view />
    </div>

    <nav class="navbar navbar-expand-sm">
      <div class="container">
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <a class="nav-link" href="https://github.com/rigwild" target="_blank" rel="noopener">rigwild - GitHub</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="https://github.com/rigwild/aeic-bot2" target="_blank" rel="noopener">github/aeic-bot2</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="https://github.com/rigwild/aeic-bot2-dashboard" target="_blank" rel="noopener">github/aeic-bot2-dashboard</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters(['isLoggedIn', 'discordFullPseudo'])
  },
  methods: {
    ...mapMutations(['setLoggedOut'])
  }
}
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>
