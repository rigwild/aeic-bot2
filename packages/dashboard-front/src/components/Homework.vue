<template>
  <div class="container">
    <b-modal :visible="!!toDeleteId" title="Are you sure ?" @ok=" deleteHomeworkId" @cancel="toDeleteId = null">
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
        <b-list-group v-if="data.length > 0" :key="data.length" class="scrollable">
          <b-list-group-item v-for="(anHomework, index) in data" :key="`homework-${index}`" class="flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">{{ anHomework.subject }}</h5>
              <small>Added the {{ toHumanDateTime(new Date(anHomework.addedDate)) }}</small>
            </div>

            <p class="mb-1">{{ anHomework.content }}</p>

            <div class="d-flex w-100 justify-content-between">
              <div>
                <small>
                  Due date: {{ toHumanDate(new Date(anHomework.dueDate)) }}
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
      </template>
      <template v-slot:rejected="error">
        <b-alert show variant="warning">{{ error.message }}</b-alert>
      </template>
    </Promised>

    <form v-if="currentTpGroup" @submit.prevent="addHomework" class="mt-4">
      <h4>Add a new homework</h4>
      <fieldset :disabled="loading">
        <div class="form-group">
          <input v-model="newHomework.subject" type="text" class="form-control" placeholder="Subject">
        </div>
        <div class="form-group">
          <textarea v-model="newHomework.content" type="text" class="form-control" placeholder="Content"></textarea>
        </div>
        <div class="form-group">
          Due date
          <input v-model="newHomework.dueDate" type="date" class="form-control" placeholder="Due date" :min="new Date().toISOString().split('T')[0]">
        </div>
        <button type="submit" class="btn btn-primary">Add</button>
      </fieldset>
    </form>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { toHumanDate, toHumanDateTime } from '@aeic-bot2/common'

import { API_CALL_SHORT } from '@/utils'
import Loader from '@/components/Loader'

export default {
  components: {
    Loader
  },
  data() {
    return {
      promise: null,

      // New homework form
      loading: false,
      newHomework: {
        subject: null,
        content: null,
        dueDate: null
      },

      // Homework ID to delete (sent to modal)
      toDeleteId: null
    }
  },
  computed: {
    ...mapState(['discordUser']),
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
      if (!tpGroup) {
        this.promise = Promise.reject(new Error('You need to be in a TP group to see its homework.'))
        return
      }
      this.promise = API_CALL_SHORT(`/dashboard/tpGroup/${tpGroup}/homework`)
    },

    // Add an homework for the current TP group
    addHomework() {
      const tpGroup = this.currentTpGroup
      if (!tpGroup) {
        this.promise = Promise.reject(new Error('You need to be in a TP group to edit its homework.'))
        return
      }

      // Check form is not missing fields
      if (!this.newHomework.subject || !this.newHomework.content || !this.newHomework.dueDate) {
        this.promise = Promise.reject(new Error('All fields are required.'))
        return
      }

      this.loading = true
      this.promise = API_CALL_SHORT(`/dashboard/tpGroup/${tpGroup}/homework/`, {
        homework: {
          ...this.newHomework,
          authorId: this.discordUser.id
        }
      }, 'PUT')
        .finally(() => (this.loading = false))
    },

    // Delete an homework for the current TP group
    async deleteHomeworkId() {
      const tpGroup = this.currentTpGroup
      if (!tpGroup) {
        this.promise = Promise.reject(new Error('You need to be in a TP group to edit its homework.'))
        return
      }
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
