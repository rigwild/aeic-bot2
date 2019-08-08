<template>
  <div class="text-center">
    <div v-if="loading">
      <p>Connecting with Discord...</p>

      <Loader />
    </div>
    <div v-else-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader'
import { sendDiscordCallbackCode } from '../utils'
import { mapMutations } from 'vuex'

export default {
  name: 'DiscordCallback',
  components: {
    Loader
  },
  data() {
    return {
      loading: true,
      error: null
    }
  },
  async mounted() {
    try {
      const code = location.search.replace('?code=', '')
      if (!code) throw new Error('No code was passed in url query')

      await sendDiscordCallbackCode(code)
      this.$router.replace({ name: 'Dashboard' })
      this.cleanUrl()
    }
    catch (err) {
      console.error(err)
      this.error = err.message
      if (err.message === 'You can\'t access this resource with a authorization header token set.') {
        this.$router.replace({ name: 'Home' })
        this.cleanUrl()
      }
    }
    finally {
      this.loading = false
    }
  },
  methods: {
    cleanUrl() {
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }
}
</script>
