<template>
  <div>
    <h1>Dashboard - IUT</h1>
    <hr>
    <Moodle />
    <hr>
    <Planning />
    <hr>
    <ExoPlatform />
  </div>
</template>

<script>
import Moodle from '@/components/Moodle.vue'
import Planning from '@/components/Planning.vue'
import ExoPlatform from '@/components/ExoPlatform.vue'

export default {
  name: 'DashboardIut',
  components: {
    Moodle,
    Planning,
    ExoPlatform
  }
}
</script>
