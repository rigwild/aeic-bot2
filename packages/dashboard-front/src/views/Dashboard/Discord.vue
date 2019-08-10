<template>
  <div>
    <h1>Dashboard - Discord</h1>
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
  </div>
</template>

<script>
import UserCard from '@/components/UserCard.vue'
import SetYearGroup from '@/components/SetYearGroup.vue'
import SetTpGroup from '@/components/SetTpGroup.vue'
import SetAssoGroup from '@/components/SetAssoGroup.vue'
import Homework from '@/components/Homework.vue'

export default {
  name: 'Dashboard',
  components: {
    UserCard,
    SetYearGroup,
    SetTpGroup,
    SetAssoGroup,
    Homework
  }
}
</script>
