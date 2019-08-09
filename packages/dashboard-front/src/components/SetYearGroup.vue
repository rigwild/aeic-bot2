<template>
  <div class="container">
    <h2>Year group</h2>
    <form @submit.prevent="sendForm">
      <fieldset :disabled="loading">
        <div class="form-group">
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
        { value: '1ère année', text: '1ère année' },
        { value: '2ème année FI', text: '2ème année FI' },
        { value: '2ème année APP', text: '2ème année APP' }
      ],
      selectedValue: null
    }
  },
  computed: {
    ...mapState(['discordUser'])
  },
  mounted() {
    this.selectedValue = this.selectOptions.map(x => x.value).find(x => this.discordUser.roles.includes(x)) || null
  },
  methods: {
    ...mapActions(['setYearGroup']),

    async sendForm() {
      if (!this.selectedValue) {
        this.promise = Promise.reject(new Error('You must select an option.'))
        return
      }
      this.loading = true
      this.promise = this.setYearGroup(this.selectedValue)
        .finally(() => (this.loading = false))
    }
  }
}
</script>
