import { config, msgId, utilsCore } from '@aeic-bot2/core'
const { COMMAND_TRIGGER: t } = config
const { tpGroupExists } = utilsCore

import { Command } from '../types'

const command: Command = {
  meta: {
    command: 'choisirGroupeTp',
    minArgs: 1,
    maxArgs: 1,
    description: 'Choisir le groupe de TP à rejoindre',
    examples: [
      // !choisirGroupeTp tp1a
      `${t}choisirGroupeTp tp1a`,
      `${t}choisirGroupeTp tp2b`
    ]
  },

  async run(message, tpGroup) {
    // Check the TP group exists
    if (!tpGroupExists(tpGroup))
      throw new Error(msgId.UNKNOWN_GROUP_TP(tpGroup))

    // Delete other TP groups roles and add the new one
    const author = await message.guild.member(message.author)
    const rolesToDelete = author.roles.filter(aRole => tpGroupExists(aRole.name))
    const roleToAdd = message.guild.roles.find(aRole => aRole.name.toLowerCase() === tpGroup.toLowerCase())
    await author.removeRoles(rolesToDelete)
    await author.addRole(roleToAdd)

    await message.reply(msgId.TP_GROUP_ROLE_ADDED(tpGroup.toLowerCase()))
  }
}
export default command
