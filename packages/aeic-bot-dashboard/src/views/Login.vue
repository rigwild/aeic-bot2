<template>
  <div class="text-center">
    <h1>Login to your dashboard</h1>
    <a :href="discordApiLink">
      <img src="../assets/login-discord.png" class="img-fluid login-discord" alt="Log in with Discord" />
    </a>
  </div>
</template>

<script>
import { API_ROUTES } from '../utils'
export default {
  name: 'Login',
  computed: {
    discordApiLink() {
      return `//${API_ROUTES.discordRedirect}`
    }
  }
}
</script>

<style>
.login-discord {
  width: 300px;
}
</style>
