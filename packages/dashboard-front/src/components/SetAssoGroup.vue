<template>
  <div class="container">
    <h2>Student association group</h2>
    <form @submit.prevent="sendForm">
      <fieldset :disabled="loading">
        <div class="form-group">
          <label for="yearGroup">Year group</label>
          <b-form-select v-model="selectedValue" :options="selectOptions" />
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </fieldset>
    </form>

    <Promised :promise="promise" class="mt-2">
      <template v-slot:pending>
        <div class="text-center">
          <Loader />
        </div>
      </template>
      <template v-slot="data">
        <b-alert show variant="success" dismissible>
          <b>Success!</b>
          <ul class="mb-0">
            <li>Added role: {{ data.addedRole }}</li>
            <li>Removed roles: {{ data.deletedRoles.join(', ') }}</li>
          </ul>
        </b-alert>
      </template>
      <template v-slot:rejected="error">
        <b-alert show variant="danger" dismissible>{{ error.message }}</b-alert>
      </template>
    </Promised>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Loader from '@/components/Loader'

export default {
  components: {
    Loader
  },
  data() {
    return {
      promise: null,
      loading: false,

      selectOptions: [
        { value: null, text: 'Select an option' },
        { value: 'Omega', text: 'Omega' },
        { value: 'Sigma', text: 'Sigma' },
        { value: 'Theta', text: 'Theta' },
        { value: 'Delta', text: 'Delta' }
      ],
      selectedValue: null
    }
  },
  computed: {
    ...mapState(['discordUser'])
  },
  mounted() {
    this.selectedValue = this.selectOptions.map(x => x.value).find(x => this.discordUser.roles.includes(x))
  },
  methods: {
    ...mapActions(['sendAssoGroup']),

    async sendForm() {
      if (!this.selectedValue) {
        this.promise = Promise.reject(new Error('You must select an option.'))
        return
      }
      this.loading = true
      this.promise = this.sendAssoGroup(this.selectedValue)
        .finally(() => (this.loading = false))
    }
  }
}
</script>
