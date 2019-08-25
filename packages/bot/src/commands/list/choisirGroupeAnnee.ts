import { config, msgId, utilsCore } from '@aeic-bot2/core'
const { COMMAND_TRIGGER: t } = config
const { removeAccents } = utilsCore

import { Command } from '../types'

const command: Command = {
  meta: {
    command: 'choisirGroupeAnnee',
    minArgs: 1,
    maxArgs: 1,
    description: 'Choisir le groupe d\'année à rejoindre',
    examples: [
      // !choisirGroupeAnnee 1ère année
      `${t}choisirGroupeAnnee 1ère année`,
      `${t}choisirGroupeAnnee 1ere annee`,
      `${t}choisirGroupeAnnee 2ème année FI`,
      `${t}choisirGroupeAnnee 2ème année APP`,
      `${t}choisirGroupeAnnee 2eme annee app`
    ]
  },

  async run(message, yearGroup) {
    const yearGroups = [
      '1ère année',
      '2ème année FI',
      '2ème année APP'
    ].map(x => removeAccents(x).toLowerCase())

    // Check the year group exists
    if (!yearGroups.includes(removeAccents(yearGroup).toLowerCase()))
      throw new Error(msgId.UNKNOWN_GROUP(yearGroup))

    // Delete other year groups roles and add the new one
    const author = await message.guild.member(message.author)
    const rolesToDelete = author.roles.filter(aRole => !!yearGroups.find(aYearGroup => removeAccents(aYearGroup).toLowerCase() === removeAccents(aRole.name).toLowerCase()))
    const roleToAdd = message.guild.roles.find(aRole => removeAccents(aRole.name).toLowerCase() === removeAccents(yearGroup).toLowerCase())
    await author.removeRoles(rolesToDelete)
    await author.addRole(roleToAdd)

    await message.reply(msgId.YEAR_GROUP_ROLE_ADDED(yearGroup))
  }
}
export default command
