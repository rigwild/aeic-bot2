<template>
  <div class="container">
    <h2>Discord user</h2>

    <div class="row justify-content-md-center">
      <div class="col-3 profile">
        <h4>User profile</h4>
        <b-img :src="discordUser.avatarURL" fluid alt="Discord avatar" class="rounded-circle shadow avatar" />
        <div>{{ discordFullPseudo }}</div>
        <div>Id: {{ discordUser.id }}</div>
        <div>Username: {{ discordUser.username }}</div>
        <div>Display name: <span :style="{ color: discordUser.displayHexColor }">{{ discordUser.displayName }}</span></div>
        <div>Highest role: <span :style="{ color: discordUser.highestRole.hexColor }">{{ discordUser.highestRole.name }}</span></div>
        <div>Discriminator: {{ discordUser.discriminator }}</div>
      </div>
      <div class="col-3">
        <h4 class="text-center">Roles list</h4>
        <ul class="list-group">
          <li v-for="(aRole, index) in discordUser.roles" :key="`role-${index}`" class="list-group-item">
            {{ aRole }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState(['discordUser']),
    ...mapGetters(['discordFullPseudo'])
  }
}
</script>

<style scoped>
.profile {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.avatar {
  margin: 5px 0px 13px;
  border: 3px solid #ffffff;
}
</style>
