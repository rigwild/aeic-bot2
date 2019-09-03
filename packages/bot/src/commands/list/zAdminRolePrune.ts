import { config, msgId } from '@aeic-bot2/core'
const { COMMAND_TRIGGER: t } = config

import { Command } from '../types'

const command: Command = {
  meta: {
    command: 'zAdminRolePrune',
    minArgs: 1,
    maxArgs: 1,
    description: `Retirer un rôle à tous les membres qui le possèdent (exemple : vider un groupe de classe en fin d'année). **Nécessite la permission administrateur**.`,
    examples: [
      // !zAdminRolePrune 2tpb
      `${t}zAdminRolePrune 2tpb`,
      `${t}zAdminRolePrune 1ère année`,
      `${t}zAdminRolePrune licence pro`,
      `${t}zAdminRolePrune omega`
    ]
  },

  async run(message, role) {
    // Check the member has administration permission
    if (!message.member.hasPermission('ADMINISTRATOR')) throw new Error(msgId.NO_PERMISSION)

    // Find the role to delete
    const dRole = await message.guild.roles.find(aRole => aRole.name.toLowerCase() === role.toLowerCase())
    if (!dRole) throw new Error(msgId.UNKNOWN_ROLE(role))

    await message.channel.send(msgId.REQUEST_LOADING())

    const count = dRole.members.size

    // Remove the role from all members that have it
    for (const aMember of dRole.members.values())
      await aMember.removeRole(dRole)

    await message.reply(msgId.ROLE_REMOVED(role, count))
  }
}
export default command
