import { config, msgId, utilsCore } from '@aeic-bot2/core'
const { COMMAND_TRIGGER: t } = config
const { tpGroupExists } = utilsCore

import { Command } from '../types'
import { GuildMember } from '@aeic-bot2/core/dist/types'

const command: Command = {
  meta: {
    command: 'choisirGroupeTp',
    minArgs: 1,
    maxArgs: 1,
    description: 'Choisir le groupe de TP à rejoindre. Utiliser `remove` pour le retirer.',
    examples: [
      // !choisirGroupeTp 1tpa
      `${t}choisirGroupeTp 1tpa`,
      `${t}choisirGroupeTp 1tpb`,
      `${t}choisirGroupeTp 1tpc`,
      `${t}choisirGroupeTp 1tpd`,
      `${t}choisirGroupeTp 1tpe`,
      `${t}choisirGroupeTp 2tpa`,
      `${t}choisirGroupeTp 2tpb`,
      `${t}choisirGroupeTp 2tpc`,
      `${t}choisirGroupeTp 2app`,
      `${t}choisirGroupeTp licencepro`,
      `${t}choisirGroupeTp remove`
    ]
  },

  async run(message, tpGroup) {
    // Remove TP group role
    if (tpGroup === 'remove') {
      const author = await message.guild?.member(message.author)
      await author?.roles.remove(author.roles.cache.filter(aRole => tpGroupExists(aRole.name)))
      await message.reply(msgId.ROLE_REMOVED())
      return
    }

    // Check the TP group exists
    if (!tpGroupExists(tpGroup))
      throw new Error(msgId.UNKNOWN_GROUP_TP(tpGroup))

    // Delete other TP groups roles and add the new one
    const author = await message.guild?.member(message.author) as GuildMember 
    const rolesToDelete = author.roles.cache.filter(aRole => tpGroupExists(aRole.name))
    const roleToAdd = message.guild?.roles.cache.find(aRole => aRole.name.toLowerCase() === tpGroup.toLowerCase())
    await author.roles.remove(rolesToDelete)
    if (roleToAdd) await author.roles.add(roleToAdd)

    await message.reply(msgId.TP_GROUP_ROLE_ADDED(tpGroup.toLowerCase()))
  }
}
export default command
