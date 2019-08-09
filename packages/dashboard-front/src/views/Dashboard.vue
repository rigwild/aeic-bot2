<template>
  <div>
    <h1>Dashboard</h1>
    <hr>
    <UserCard />
    <hr>
    <SetYearGroup />
    <hr>
    <SetTpGroup />
    <hr>
    <SetAssoGroup />
    <hr>
    <Homework />
    <hr>
    <Planning />
    <hr>
    <ExoPlatform />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import UserCard from '@/components/UserCard.vue'
import Planning from '@/components/Planning.vue'
import SetYearGroup from '@/components/SetYearGroup.vue'
import SetTpGroup from '@/components/SetTpGroup.vue'
import SetAssoGroup from '@/components/SetAssoGroup.vue'
import Homework from '@/components/Homework.vue'
import ExoPlatform from '@/components/ExoPlatform.vue'

export default {
  name: 'Dashboard',
  components: {
    UserCard,
    Planning,
    SetYearGroup,
    SetTpGroup,
    SetAssoGroup,
    Homework,
    ExoPlatform
  },
  computed: {
    ...mapState(['discordUser'])
  },
  async mounted() {

  }
}
</script>
