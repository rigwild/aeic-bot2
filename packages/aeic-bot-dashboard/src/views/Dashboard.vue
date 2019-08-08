<template>
  <div>
    <h1>Dashboard</h1>
    <hr>
    <UserCard />
    <hr>
    <SetYearGroup />
    <hr>
    <SetAssoGroup />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UserCard from '@/components/UserCard.vue'
import SetYearGroup from '@/components/SetYearGroup.vue'
import SetAssoGroup from '@/components/SetAssoGroup.vue'

export default {
  name: 'Dashboard',
  components: {
    UserCard,
    SetYearGroup,
    SetAssoGroup
  },
  computed: {
    ...mapState(['discordUser'])
  }
}
</script>
