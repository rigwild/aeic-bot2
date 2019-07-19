import { Command } from '../types'
import { hasAuthorRole, isMessageInChannel } from '../utils'
import msgId from '../../msgId'
import { COMMAND_TRIGGER as t } from '../../config'
import { TpGroupModel } from '../../database/TpGroup'

const command: Command = {
  meta: {
    command: 'afficherDevoir',
    minArgs: 1,
    maxArgs: 1,
    description: 'Afficher les devoirs d\'un groupe de TP',
    examples: [
      // !afficherDevoir tp1a
      `${t}afficherDevoir tp1a`,
      `${t}afficherDevoir tp2b`
    ]
  },

  async run(message, ...[tpGroup]) {
    // Check the message was sent in the TP group channel
    if (!isMessageInChannel(message, tpGroup))
      throw new Error(msgId.NOT_IN_CHANNEL(tpGroup))

    // Check the author has the TP group role
    if (!(await hasAuthorRole(message, tpGroup)))
      throw new Error(msgId.MISSING_ROLE(tpGroup))

    const tpGroupData = await TpGroupModel.findOne({ name: tpGroup.toLowerCase() })
      .exec()
      .catch(() => {
        throw new Error(msgId.UNKNOWN_GROUP_TP(tpGroup))
      })

    if (!tpGroupData || !tpGroupData.homework) return message.reply(msgId.NO_HOMEWORK(tpGroup))

    // Show the homeworks in the channel, filtering to only future ones
    const dateMin = new Date(Date.now() + -1 * 24 * 3600 * 1000)
    return message.reply(tpGroupData.homework
      .filter(aHomework => dateMin < aHomework.dueDate)
      .map(aHomework => msgId.HOMEWORK_SHOW(aHomework)))
  }
}
export default command
