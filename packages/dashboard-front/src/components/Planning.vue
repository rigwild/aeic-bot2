<template>
  <div class="container">
    <h2>TP group planning</h2>
    <button @click="getPlanning" class="btn btn-secondary mb-2">Reload</button>

    <Promised :promise="promise" class="mt-2">
      <template v-slot:pending>
        <div class="text-center">
          <Loader />
        </div>
      </template>
      <template v-slot="data">
        <p>
          See <a :href="data[0].screenPath.split('screenshot')[0]" target="_blank" rel="noopener">{{ data[0].screenPath.split('screenshot')[0] }}</a> - GitHub: <a href="https://github.com/rigwild/planning-iut-calais" target="_blank" rel="noopener">rigwild/planning-iut-calais</a>.
        </p>
        <p class="text-center">
          <i>Tip: Click on the image and add the URL to your browser's favorites or your home screen!<br>The image will be automagically updated every 4 hours</i> 😉
        </p>
        <div class="container text-center mb-3">
          <div class="weekNumber">Week  1</div>
          <a :href="data[0].screenPath" target="_blank" rel="noopener"><b-img :src="data[0].screenPath" fluid alt="Planning week 1" /></a>
          <div class="weekLastUpdate">Last update: {{ toHumanDateTime(new Date(data[0].screenDate)) }}</div>
        </div>
        <div class="row">
          <div v-for="(cutData, index) in data.slice(1)" :key="index" class="col-md-4 text-center">
            <div class="weekNumber">Week {{ index + 2 }}</div>
            <a :href="cutData.screenPath" target="_blank" rel="noopener"><b-img :src="cutData.screenPath" fluid :alt="`Planning week ${index + 1}`" /></a>
            <div class="weekLastUpdate">Last update: {{ toHumanDateTime(new Date(cutData.screenDate)) }}</div>
          </div>
        </div>
      </template>
      <template v-slot:rejected="error">
        <b-alert show variant="warning">{{ error.message }}</b-alert>
      </template>
    </Promised>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { toHumanDateTime } from '@aeic-bot2/common'

import Loader from '@/components/Loader'
import { API_CALL_SHORT } from '@/utils'

export default {
  components: {
    Loader
  },
  data() {
    return {
      promise: null
    }
  },
  computed: {
    ...mapGetters(['currentTpGroup'])
  },
  mounted() {
    this.getPlanning()
  },
  methods: {
    toHumanDateTime,

    // Load planning for the current TP group
    getPlanning() {
      const tpGroup = this.currentTpGroup
      if (!tpGroup) {
        this.promise = Promise.reject(new Error('You need to be in a TP group to see its planning.'))
        return
      }
      this.promise = API_CALL_SHORT(`/dashboard/tpGroup/${tpGroup}/planning`)
    }
  }
}
</script>

<style scoped>
.weekNumber {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 5px;
}
.weekLastUpdate {
  margin-top: 7px;
}
</style>
