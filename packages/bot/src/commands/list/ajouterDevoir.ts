import { Homework } from '@aeic-bot2/common'
import { config, msgId, utilsCore, TpGroupModel } from '@aeic-bot2/core'
const { COMMAND_TRIGGER: t, ARG_SEPARATOR: s } = config
const { tpGroupExists, hasAuthorRole } = utilsCore

import { Command } from '../types'

const command: Command = {
  meta: {
    command: 'ajouterDevoir',
    minArgs: 3,
    maxArgs: 3,
    description: 'Ajouter un devoir à un groupe de TP',
    examples: [
      // !ajouterDevoir 2020-04-24 -- Java -- TP Breakout
      `${t}ajouterDevoir 2020-04-24 ${s} Java ${s} TP Breakout`,
      `${t}ajouterDevoir 2020-01-18 ${s} Maths ${s} DS Ould-Said`
    ]
  },

  async run(message, dueDate, subject, content) {
    const tpGroup = message.channel.name
    // Check the message was sent in a TP group channel
    if (!tpGroupExists(tpGroup))
      throw new Error(msgId.NOT_IN_TP_CHANNEL)

    // Check the author has the TP group role
    if (!(await hasAuthorRole(message, tpGroup)))
      throw new Error(msgId.MISSING_ROLE(tpGroup))

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
    await message.reply(msgId.HOMEWORK_ADDED(homework, tpGroup))
  }
}
export default command
