import { removeAccents, defaultYearGroupsName } from '@aeic-bot2/common'
import { config, msgId, utilsCore } from '@aeic-bot2/core'
const { COMMAND_TRIGGER: t } = config
const { yearGroupExists } = utilsCore

import { Command } from '../types'

const command: Command = {
  meta: {
    command: 'choisirGroupeAnnee',
    minArgs: 1,
    maxArgs: 1,
    description: 'Choisir le groupe d\'année à rejoindre. Utiliser `remove` pour le retirer.',
    examples: [
      // !choisirGroupeAnnee 1ère année
      `${t}choisirGroupeAnnee 1ère année`,
      `${t}choisirGroupeAnnee 1ere annee`,
      `${t}choisirGroupeAnnee 2ème année FI`,
      `${t}choisirGroupeAnnee 2ème année APP`,
      `${t}choisirGroupeAnnee licence pro`,
      `${t}choisirGroupeAnnee ancetre`,
      `${t}choisirGroupeAnnee remove`
    ]
  },

  async run(message, yearGroup) {
    // Remove TP group role
    if (yearGroup === 'remove') {
      const author = await message.guild.member(message.author)
      await author.removeRoles(author.roles.filter(aRole => yearGroupExists(aRole.name)))
      await message.reply(msgId.ROLE_REMOVED())
      return
    }

    // Check the year group exists
    if (!yearGroupExists(yearGroup))
      throw new Error(msgId.UNKNOWN_GROUP(yearGroup))

    // Delete other year groups roles and add the new one
    const author = await message.guild.member(message.author)
    const rolesToDelete = author.roles.filter(aRole => !!defaultYearGroupsName.find(aYearGroup => removeAccents(aYearGroup).toLowerCase() === removeAccents(aRole.name).toLowerCase()))
    const roleToAdd = message.guild.roles.find(aRole => removeAccents(aRole.name).toLowerCase() === removeAccents(yearGroup).toLowerCase())
    await author.removeRoles(rolesToDelete)
    await author.addRole(roleToAdd)

    await message.reply(msgId.YEAR_GROUP_ROLE_ADDED(yearGroup))
  }
}
export default command
