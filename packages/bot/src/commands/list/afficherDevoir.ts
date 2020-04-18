import { MessageEmbed } from '@aeic-bot2/core/dist/types'

import { toHumanDateTime, toHumanDate, Homework } from '@aeic-bot2/common'
import { config, msgId, utilsCore, TpGroupModel } from '@aeic-bot2/core'
const { COMMAND_TRIGGER: t } = config
const { tpGroupExists } = utilsCore

import { Command } from '../types'

export const buildHomeworkEmbed = (tpGroup: string, homework: Homework[]) => {
  let embed = new MessageEmbed({ title: `Devoirs du groupe \`${tpGroup}\`` })
  if (homework.length > 0)
    embed.fields = homework.map(aHomework => ({
      name: `Pour le \`${toHumanDate(aHomework.dueDate)}\``,
      value: `Matière : ${aHomework.subject} - Ajouté par <@${aHomework.authorId}>${aHomework.addedDate && ` le \`${toHumanDateTime(aHomework.addedDate)}`}\`.\n\`\`\`${aHomework.content}\`\`\``,
      inline: false
    }))
  else embed.description = 'Aucun devoir **enregistré**.'
  return embed
}

const command: Command = {
  meta: {
    command: 'afficherDevoir',
    minArgs: 0,
    maxArgs: 0,
    description: 'Afficher les devoirs d\'un groupe de TP. **Commande à utiliser dans un channel de TP**.',
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
