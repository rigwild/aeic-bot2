<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link class="navbar-brand" to="#" exact>aeic-bot2-dashboard</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div v-if="isLoggedIn" class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <router-link to="/dashboard/discord" exact-active-class="active" class="nav-link">Discord</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/dashboard/iut" exact-active-class="active" class="nav-link">IUT</router-link>
            </li>
          </ul>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item pointer">
              <a class="nav-link" @click.prevent="setLoggedOut">({{ discordFullPseudo }}) - Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-2 mb-4">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>

    <nav class="navbar navbar-expand-sm mt-5">
      <div class="container">
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a class="nav-link" href="https://github.com/rigwild" target="_blank" rel="noopener">rigwild - GitHub</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="https://github.com/rigwild/aeic-bot2" target="_blank" rel="noopener">github/aeic-bot2</a>
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
.scrollable {
  overflow-x: hidden;
  max-height: 500px;
  border: 2px solid #F4F4F4;
  overflow-y: auto;
}
</style>
