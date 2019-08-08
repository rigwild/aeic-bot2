<template>
  <div class="container">
    <h2>Discord user</h2>

    <h4>User profile - {{ discordUser.username }}#{{ discordUser.discriminator }}</h4>
    <p>
      <b-img :src="`https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.webp`" fluid alt="Discord avatar" /><br>
      Id: {{ discordUser.id }}<br>
      Pseudo: {{ discordUser.username }}<br>
      Discriminator: {{ discordUser.discriminator }}
    </p>

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
