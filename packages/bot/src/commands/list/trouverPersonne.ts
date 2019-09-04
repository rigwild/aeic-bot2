import { RichEmbed, User, Message } from '@aeic-bot2/core/dist/types'

import { config, msgId, utilsCore } from '@aeic-bot2/core'
const { COMMAND_TRIGGER: t, EXO_PLATFORM_LINK } = config
const { ExoPlatformLoader } = utilsCore

import { Command } from '../types'

const command: Command = {
  meta: {
    command: 'trouverPersonne',
    minArgs: 1,
    maxArgs: 1,
    description: `Trouver un utilisateur sur eXo Platform et afficher ses données.`,
    examples: [
      // !trouverPersonne synave
      `${t}trouverPersonne synave`,
      `${t}trouverPersonne antoine sauvage`,
      `${t}trouverPersonne contact@asauvage.fr`,
      `${t}trouverPersonne act@asauvage.f`,
      `${t}trouverPersonne ^antoine`,
      `${t}trouverPersonne \@gmail\.com`
    ]
  },

  async run(message, search) {
    // Send a loading message in the channel if the request is not cached
    const loadingMessage = !ExoPlatformLoader.isCached()
      ? message.channel.send(msgId.REQUEST_LOADING_THEN_CACHED(`/${search}/gi`)).then(() => { })
      : Promise.resolve()

    // Search for the users
    const [users] = await Promise.all([ExoPlatformLoader.searchUser(search), loadingMessage])

    // Send the response
    if (users.length === 0) await message.reply(msgId.NO_EXO_USER_FOUND(search))
    else {
      let embed = new RichEmbed()
      embed.title = `Résultat de la recherche \`/${search}/gi\``
      embed.footer = { text: `https://${EXO_PLATFORM_LINK} - Date de mise en cache`, icon_url: 'https://www.exoplatform.com/wp-content/themes/westand-child/assets/images/logo.png' }
      embed.timestamp = ExoPlatformLoader.getCacheLastUpdate() || undefined
      embed.fields = users.map(aUser => ({
        name: aUser.fullname,
        value: `${aUser.username} - ${aUser.email ? aUser.email : 'Pas d\'email'} - [Lien eXo](https://${EXO_PLATFORM_LINK}/portal/intranet/profile/${aUser.username})`
      }))
      await message.reply({ embed })
    }
  }
}
export default command
