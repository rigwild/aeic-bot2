<template>
  <div class="container">
    <h2>eXo Platform user search</h2>
    <p>
      GitHub: <a href="https://github.com/rigwild/exoplatform-api-wrapper" target="_blank" rel="noopener">rigwild/exoplatform-api-wrapper</a>.
    </p>
    <form @submit.prevent="sendForm">
      <fieldset :disabled="loading">
        <div class="form-group">
          <input v-model="search" type="text" class="form-control" placeholder="Search term (string, regular expression) ...">
        </div>
        <button type="submit" class="btn btn-primary">Search</button>
      </fieldset>
    </form>

    <Promised :promise="promise" class="mt-2">
      <template v-slot:pending>
        <div class="text-center">
          <Loader />
        </div>
      </template>
      <template v-slot="data">
        <b-list-group v-if="data.length > 0" :key="data.length" class="scrollable">
          <b-list-group-item v-for="(aUser, index) in data" :key="`homework-${index}`" class="flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">{{ aUser.fullname }}</h5>
            </div>

            <p class="mb-1">
              <ul class="list-unstyled">
                <li v-if="aUser.email">Email: {{ aUser.email }}</li>
                <li v-if="aUser.gender">Gender: {{ aUser.gender }}</li>
                <li v-if="aUser.phones && aUser.phones.length > 0">Phone: {{ aUser.phones.join(' - ') }}</li>
                <li v-if="aUser.position">Current work position: {{ aUser.position }}</li>
                <li v-if="aUser.ims && aUser.ims.length > 0">
                  IM:
                  <ul>
                    <li v-for="aUserIm in aUser.ims" :key="aUserIm.imId">
                      {{ aUserIm.imType }}: {{ aUserIm.imId }}
                    </li>
                  </ul>
                </li>
                <li v-if="aUser.url && aUser.url.length > 0">
                  Website:
                  <ul>
                    <li v-for="aUserUrl in aUser.url" :key="aUserUrl.url">
                      <a :href="aUserUrl.url" target="_blank" rel="noopener noreferrer">{{ aUserUrl.url }}</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </p>

            <div class="d-flex w-100 justify-content-between">
              <div>
                <small>
                  {{ aUser.username }}
                  <span> - </span>
                  <a :href="`https://iut.univ-littoral.fr/portal/intranet/profile/${aUser.username}`" target="_blank" rel="noopener">eXo Platform link</a>
                </small>
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>
        <div v-else>No search results.</div>
      </template>
      <template v-slot:rejected="error">
        <b-alert show variant="danger" dismissible>{{ error.message }}</b-alert>
      </template>
    </Promised>
  </div>
</template>

<script>
import Loader from '@/components/Loader'
import { API_CALL_SHORT } from '@/utils'

export default {
  components: {
    Loader
  },
  data() {
    return {
      promise: null,
      loading: false,

      search: 'antoine sauvage'
    }
  },
  methods: {
    async sendForm() {
      if (!this.search) {
        this.promise = Promise.reject(new Error('You must enter a search term or a regular expression.'))
        return
      }
      this.loading = true
      this.promise = API_CALL_SHORT(`/dashboard/eXoPlatform/${this.search}`)
        .finally(() => (this.loading = false))
    }
  }
}
</script>
