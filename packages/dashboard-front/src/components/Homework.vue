<template>
  <div class="container">
    <b-modal :visible="!!toDeleteId" title="Are you sure ?" @ok="deleteHomeworkId" @cancel="toDeleteId = null">
      <p>Are you sure you want to delete this homework ?</p>
      This action is not reversible.
    </b-modal>

    <h2>TP group homework</h2>
    <button @click="getHomework" class="btn btn-secondary mb-2">Reload</button>

    <Promised :promise="promise" class="mt-2">
      <template v-slot:pending>
        <div class="text-center">
          <Loader />
        </div>
      </template>
      <template v-slot="data">
        <b-list-group v-if="data.length > 0" :key="data.length">
          <b-list-group-item v-for="(anHomework, index) in data" :key="`homework-${index}`" class="flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">{{ anHomework.subject }}</h5>
              <small>Added the {{ toHumanDateTime(anHomework.addedDate) }}</small>
            </div>

            <p class="mb-1">{{ anHomework.content }}</p>

            <div class="d-flex w-100 justify-content-between">
              <div>
                <small>
                  Due date: {{ toHumanDate(anHomework.dueDate) }}
                  <a @click.prevent="toDeleteId = anHomework._id" class="text-danger pointer">Delete</a>
                </small>
              </div>
              <div>
                <small>
                  By {{ anHomework.author.username }}#{{ anHomework.author.discriminator }}
                  (<span :style="{ color: anHomework.author.displayHexColor }">{{ anHomework.author.displayName }}</span>
                  <span> - </span>
                  <span :style="{ color: anHomework.author.highestRole.hexColor }">{{ anHomework.author.highestRole.name }}</span>)
                  <b-img :src="anHomework.author.avatarURL.replace('2048', '128')" fluid alt="Discord avatar" class="rounded-circle shadow author-avatar ml-2" />
                </small>
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>
        <div v-else>No homework saved in database for your TP group.</div>

        <div v-if="promiseAction === 'delete'" class="mt-2">
          <b-alert show variant="success" dismissible>The homework was deleted successfully.</b-alert>
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
import Loader from '@/components/Loader'
import { API_CALL_SHORT, toHumanDate, toHumanDateTime } from '@/utils'

export default {
  components: {
    Loader
  },
  data() {
    return {
      promise: null,
      promiseAction: null,

      // Homework ID to delete (sent to modal)
      toDeleteId: null
    }
  },
  computed: {
    ...mapGetters(['currentTpGroup'])
  },
  mounted() {
    this.getHomework()
  },
  methods: {
    toHumanDate,
    toHumanDateTime,
    // Load homework for the current TP group
    getHomework() {
      const tpGroup = this.currentTpGroup
      if (!tpGroup) throw new Error('You need to be in a TP group to see its homework.')
      this.promiseAction = 'load'
      this.promise = API_CALL_SHORT(`/dashboard/tpGroup/${tpGroup}/homework`)
    },

    // Delete an homework for the current TP group
    deleteHomeworkId() {
      const tpGroup = this.currentTpGroup
      if (!tpGroup) throw new Error('You need to be in a TP group to edit its homework.')
      this.promiseAction = 'delete'
      this.promise = API_CALL_SHORT(`/dashboard/tpGroup/${tpGroup}/homework/${this.toDeleteId}`, undefined, 'DELETE')
      this.toDeleteId = null
    }
  }
}
</script>

<style scoped>
.author-avatar {
  width: 40px;
  margin-top: -20px;
}
small {
  color: #8e8e8e;
}
</style>
