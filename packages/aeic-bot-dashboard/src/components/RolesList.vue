<template>
  <div class="container">
    <h4>Roles list</h4>

    <ul>
      <li v-for="(aRole, index) in discordUser.roles" :key="`role-${index}`">
        {{ aRole }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['discordUser'])
  }
}
</script>
