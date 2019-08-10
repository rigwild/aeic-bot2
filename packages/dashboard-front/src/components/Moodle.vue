<template>
  <div class="container">
    <h2>Moodle calendar</h2>
    <form @submit.prevent="getCalendar" class="mt-4">
      <h4>Load my calendar</h4>
      <fieldset :disabled="loading">
        <div class="form-group">
          <input v-model="form.username" type="text" class="form-control" placeholder="Moodle username">
        </div>
        <div class="form-group">
          <input v-model="form.password" type="password" class="form-control" placeholder="Moodle password" />
        </div>
        <button type="submit" class="btn btn-primary mb-2">Load calendar</button>
        <div class="form-check">
          <input v-model="form.saveCredentials" class="form-check-input" type="checkbox" id="saveCredentials">
          <label class="form-check-label" for="saveCredentials">
            Save Moodle credentials in your browser ? (They are sent to the server to log in to Moodle but <a href="https://github.com/rigwild/aeic-bot2/blob/master/packages/dashboard-back/src/server/routes/dashboard/moodle.ts" target="_blank" rel="noopener">they are not stored!</a> 🔒)
          </label>
        </div>
      </fieldset>
    </form>

    <Promised :promise="promise" class="mt-2">
      <template v-slot:pending>
        <div class="text-center">
          <Loader />
        </div>
      </template>
      <template v-slot="data">
        <div class="iframe-container">
          <iframe :srcdoc="data" sandbox></iframe>
        </div>
      </template>
      <template v-slot:rejected="error">
        <b-alert show variant="danger">{{ error.message }}</b-alert>
      </template>
    </Promised>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import Loader from '@/components/Loader'
import { API_CALL_SHORT } from '@/utils'

export default {
  components: {
    Loader
  },
  data() {
    return {
      promise: null,

      // Moodle credentials
      loading: false,
      form: {
        username: '',
        password: '',
        saveCredentials: false
      }
    }
  },
  computed: {
    ...mapState(['moodle']),
    ...mapGetters(['areMoodleCredentialsSaved'])
  },
  watch: {
    'form.saveCredentials'(newValue) {
      if (!newValue) this.unsaveMoodleCredentials()
    }
  },
  mounted() {
    if (this.areMoodleCredentialsSaved) {
      this.form.username = this.moodle.username
      this.form.password = this.moodle.password
      this.form.saveCredentials = true
      this.getCalendar()
    }
  },
  methods: {
    ...mapMutations(['setMoodleCredentials', 'unsaveMoodleCredentials']),

    // Load the user Moodle calendar
    getCalendar() {
      // Check form is not missing fields
      if (!this.form.username || !this.form.password) {
        this.promise = Promise.reject(new Error('All fields are required.'))
        return
      }

      // Save credentials in browser
      if (this.form.saveCredentials) this.setMoodleCredentials(this.form)

      // Load the planning
      this.loading = true
      this.promise = API_CALL_SHORT('/dashboard/moodle', {
        username: this.form.username,
        password: this.form.password
      }, 'POST')
        .then(res => {
          // Save credentials in browser
          if (this.form.saveCredentials) this.setMoodleCredentials(this.form)
          else {
            this.form.username = ''
            this.form.password = ''
          }
          return res
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>
iframe {
  width: 100%;
  height: 500px;
  border: none;
  border-bottom: 2px solid #ebebeb;
}
</style>
