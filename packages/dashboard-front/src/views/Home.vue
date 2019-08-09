<template>
  <div class="text-center">
    <h1>Login to your dashboard</h1>
    <a :href="discordApiLink">
      <img src="../assets/login-discord.png" class="img-fluid login-discord" alt="Log in with Discord" />
    </a>
  </div>
</template>

<script>
import { API_PREFIX } from '../utils'

export default {
  name: 'Login',
  computed: {
    discordApiLink() {
      return `${API_PREFIX}/login/discordRedirect`
    }
  }
}
</script>

<style>
.login-discord {
  width: 300px;
}
</style>
