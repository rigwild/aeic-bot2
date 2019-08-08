import { Command } from '../types'
import { COMMAND_TRIGGER as t } from '../../config'
import { assoGroupExists } from '../utils'
import msgId from '../../msgId'

const command: Command = {
  meta: {
    command: 'choisirGroupeAsso',
    minArgs: 1,
    maxArgs: 1,
    description: 'Choisir le groupe d\'association à rejoindre',
    examples: [
      // !choisirGroupeAsso asso1
      `${t}choisirGroupeAsso asso1`,
      `${t}choisirGroupeAsso asso2`
    ]
  },

  async run(message, ...[assoGroup]) {
    // Check the association group exists
    if (!assoGroupExists(assoGroup))
      throw new Error(msgId.UNKNOWN_GROUP_ASSO(assoGroup))

    // Delete other association groups roles and add the new one
    const author = await message.guild.member(message.author)
    const rolesToDelete = author.roles.filter(aRole => assoGroupExists(aRole.name))
    const roleToAdd = message.guild.roles.find(aRole => aRole.name.toLowerCase() === assoGroup.toLowerCase())
    await author.removeRoles(rolesToDelete)
    await author.addRole(roleToAdd)

    await message.reply(msgId.ASSO_GROUP_ROLE_ADDED(assoGroup.toLowerCase()))
  }
}
export default command
