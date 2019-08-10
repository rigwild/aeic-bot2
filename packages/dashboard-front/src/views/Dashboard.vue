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
    <Moodle />
    <hr>
    <Planning />
    <hr>
    <ExoPlatform />
  </div>
</template>

<script>
import UserCard from '@/components/UserCard.vue'
import SetYearGroup from '@/components/SetYearGroup.vue'
import SetTpGroup from '@/components/SetTpGroup.vue'
import SetAssoGroup from '@/components/SetAssoGroup.vue'
import Homework from '@/components/Homework.vue'
import Moodle from '@/components/Moodle.vue'
import Planning from '@/components/Planning.vue'
import ExoPlatform from '@/components/ExoPlatform.vue'

export default {
  name: 'Dashboard',
  components: {
    UserCard,
    SetYearGroup,
    SetTpGroup,
    SetAssoGroup,
    Homework,
    Moodle,
    Planning,
    ExoPlatform
  }
}
</script>
