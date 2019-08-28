<template>
  <div class="container">
    <h2>Scodoc marks</h2>
    <form @submit.prevent="getMarks" class="mt-4">
      <h4>Load my marks</h4>
      <fieldset :disabled="loading">
        <div class="form-group">
          <input v-model="form.ine" type="text" class="form-control" placeholder="Student INE">
        </div>
        <button type="submit" class="btn btn-primary mb-2">Load marks</button>
        <div class="form-check">
          <input v-model="form.saveCredentials" class="form-check-input" type="checkbox" id="saveCredentialsScodoc">
          <label class="form-check-label" for="saveCredentialsScodoc">
            Save INE in your browser ? (They are sent to the server to log in to Scodoc but <a href="https://github.com/rigwild/aeic-bot2/blob/master/packages/dashboard-back/src/server/routes/dashboard/scodoc.ts" target="_blank" rel="noopener">they are not stored!</a> 🔒)
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
import { mapState, mapMutations } from 'vuex'

import Loader from '@/components/Loader'
import { API_CALL_SHORT } from '@/utils'

export default {
  components: {
    Loader
  },
  data() {
    return {
      promise: null,

      // INE
      loading: false,
      form: {
        ine: '',
        saveCredentials: false
      }
    }
  },
  computed: {
    ...mapState(['ine'])
  },
  watch: {
    'form.saveCredentials'(newValue) {
      if (!newValue) this.unsaveIne()
    }
  },
  mounted() {
    if (this.ine) {
      this.form.ine = this.ine
      this.form.saveCredentials = true
      this.getMarks()
    }
  },
  methods: {
    ...mapMutations(['setIne', 'unsaveIne']),

    // Load the student's marks
    getMarks() {
      // Check form is not missing fields
      if (!this.form.ine) {
        this.promise = Promise.reject(new Error('All fields are required.'))
        return
      }

      // Save credentials in browser
      if (this.form.saveCredentials) this.setIne(this.form)

      // Load the marks
      this.loading = true
      this.promise = API_CALL_SHORT(`/dashboard/scodoc/${this.form.ine}`)
        .then(res => {
          // Save credentials in browser
          if (this.form.saveCredentials) this.setIne(this.form)
          else this.form.ine = ''
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
}
</style>
