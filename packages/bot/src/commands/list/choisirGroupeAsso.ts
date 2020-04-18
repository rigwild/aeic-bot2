import { config, msgId, utilsCore } from '@aeic-bot2/core'
const { COMMAND_TRIGGER: t } = config
const { assoGroupExists } = utilsCore

import { Command } from '../types'
import { GuildMember } from '@aeic-bot2/core/dist/types'

const command: Command = {
  meta: {
    command: 'choisirGroupeAsso',
    minArgs: 1,
    maxArgs: 1,
    description: 'Choisir le groupe d\'association étudiante à rejoindre. Utiliser `remove` pour le retirer.',
    examples: [
      // !choisirGroupeAsso beta
      `${t}choisirGroupeAsso delta`,
      `${t}choisirGroupeAsso beta`,
      `${t}choisirGroupeAsso omega`,
      `${t}choisirGroupeAsso theta`,
      `${t}choisirGroupeAsso remove`
    ]
  },

  async run(message, assoGroup) {
    // Remove Asso group role
    if (assoGroup === 'remove') {
      const author = await message.guild?.member(message.author) as GuildMember 
      await author.roles.remove(author.roles.cache.filter(aRole => assoGroupExists(aRole.name)))
      await message.reply(msgId.ROLE_REMOVED())
      return
    }

    // Check the association group exists
    if (!assoGroupExists(assoGroup))
      throw new Error(msgId.UNKNOWN_GROUP_ASSO(assoGroup))

    // Delete other association groups roles and add the new one
    const author = await message.guild?.member(message.author) as GuildMember
    const rolesToDelete = author.roles.cache.filter(aRole => assoGroupExists(aRole.name))
    const roleToAdd = message.guild?.roles.cache.find(aRole => aRole.name.toLowerCase() === assoGroup.toLowerCase())
    await author.roles.remove(rolesToDelete)
    if (roleToAdd) await author.roles.add(roleToAdd)

    await message.reply(msgId.ASSO_GROUP_ROLE_ADDED(assoGroup.toLowerCase()))
  }
}
export default command
