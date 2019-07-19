import { Command } from '../types'
import { tpGroupExists, hasAuthorRole, isMessageInChannel } from '../utils'
import msgId from '../../msgId'
import { ARG_SEPARATOR as s, COMMAND_TRIGGER as t } from '../../config'
import { TpGroupModel, Homework } from '../../database/TpGroup'

const command: Command = {
  meta: {
    command: 'ajouterDevoir',
    minArgs: 4,
    maxArgs: 4,
    description: 'Ajouter un devoir à un groupe de TP',
    examples: [
      // !ajouterDevoir tp1a -- 2020-04-24 -- Java -- TP Breakout
      `${t}ajouterDevoir tp1a ${s} 2020-04-24 ${s} Java ${s} TP Breakout`,
      `${t}ajouterDevoir tp2b ${s} 2020-01-18 ${s} Maths ${s} DS Ould-Said`
    ]
  },

  async run(message, ...[tpGroup, dueDate, subject, content]) {
    // Check the message was sent in the TP group channel
    if (!isMessageInChannel(message, tpGroup))
      throw new Error(msgId.NOT_IN_CHANNEL(tpGroup))

    // Check the author has the TP group role
    if (!(await hasAuthorRole(message, tpGroup)))
      throw new Error(msgId.MISSING_ROLE(tpGroup))

    // Check the TP group exists
    if (!(await tpGroupExists(tpGroup)))
      throw new Error(msgId.UNKNOWN_GROUP_TP(tpGroup))

    // Check the dueDate is a valid date
    const parsedDueDate = Date.parse(dueDate)
    if (isNaN(parsedDueDate)) throw new Error(msgId.INVALID_DATE)

    // Check the dueDate is in the future
    if (parsedDueDate < Date.now()) throw new Error(msgId.DATE_IN_PAST)

    // Add the homework to the group
    const homework: Homework = {
      authorId: message.author.id,
      subject,
      content,
      dueDate: new Date(parsedDueDate)
    }
    const addedHomework = await TpGroupModel.findOneAndUpdate({ name: tpGroup.toLowerCase() },
      { $push: { homework } },
      { runValidators: true, new: true })

    if (!addedHomework || !addedHomework.homework) return
    return message.reply(msgId.HOMEWORK_ADDED(homework, tpGroup))
  }
}
export default command
