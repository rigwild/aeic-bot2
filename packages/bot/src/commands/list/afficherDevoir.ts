import { RichEmbed } from '@aeic-bot2/core/dist/types'

import { toHumanDateTime, toHumanDate, Homework } from '@aeic-bot2/common'
import { config, msgId, utilsCore, TpGroupModel } from '@aeic-bot2/core'
const { COMMAND_TRIGGER: t } = config
const { hasAuthorRole, tpGroupExists } = utilsCore

import { Command } from '../types'

export const buildHomeworkEmbed = (tpGroup: string, homework: Homework[]) => new RichEmbed({
  title: `Devoirs du groupe \`${tpGroup}\``,
  fields: homework.map(aHomework => ({
    name: `Pour le \`${toHumanDate(aHomework.dueDate)}\``,
    value: `Matière : ${aHomework.subject} - Ajouté par <@${aHomework.authorId}>${aHomework.addedDate && ` le \`${toHumanDateTime(aHomework.addedDate)}`}\`.\n\`\`\`${aHomework.content}\`\`\``
  }))
})

const command: Command = {
  meta: {
    command: 'afficherDevoir',
    minArgs: 0,
    maxArgs: 0,
    description: 'Afficher les devoirs d\'un groupe de TP',
    examples: [
      // !afficherDevoir
      `${t}afficherDevoir`
    ]
  },

  async run(message) {
    const tpGroup = message.channel.name

    // Check the message was sent in a TP group channel
    if (!tpGroupExists(tpGroup))
      throw new Error(msgId.NOT_IN_TP_CHANNEL)

    // Check the author has the TP group role
    if (!(await hasAuthorRole(message, tpGroup)))
      throw new Error(msgId.MISSING_ROLE(tpGroup))

    const tpGroupData = await TpGroupModel.findOne({ name: tpGroup.toLowerCase() })
    if (!tpGroupData || !tpGroupData.homework)
      throw new Error(msgId.UNKNOWN_GROUP_TP(tpGroup))

    // Filter homework due in the future
    const dateMin = new Date(Date.now() + -1 * 24 * 3600 * 1000)
    const homework = tpGroupData.homework.filter(aHomework => dateMin < aHomework.dueDate)

    // Check the group has homework
    if (homework.length === 0)
      throw new Error(msgId.NO_HOMEWORK(tpGroup))

    await message.reply({ embed: buildHomeworkEmbed(tpGroup, homework) })
  }
}
export default command
