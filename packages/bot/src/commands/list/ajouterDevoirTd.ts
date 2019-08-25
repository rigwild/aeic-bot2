import { TextChannel } from '@aeic-bot2/core/dist/types'

import { config, msgId, utilsCore, TpGroupModel } from '@aeic-bot2/core'
const { COMMAND_TRIGGER: t, ARG_SEPARATOR: s } = config
const { isMessageInChannel, hasAuthorRoleSome } = utilsCore
import { Homework } from '@aeic-bot2/core/dist/types'

import { Command } from '../types'

const command: Command = {
  meta: {
    command: 'ajouterDevoirTd',
    minArgs: 5,
    maxArgs: 5,
    description: 'Ajouter un devoir à un groupe de TD',
    examples: [
      // !ajouterDevoirTd td1 -- dut1 -- 2020-04-24 -- Java -- TP Breakout
      `${t}ajouterDevoirTd td1 ${s} dut1 ${s} 2020-04-24 ${s} Java ${s} TP Breakout`,
      `${t}ajouterDevoirTd td1 ${s} dut2 ${s} 2020-01-18 ${s} Maths ${s} DS Ould-Said`
    ]
  },

  async run(message, tdGroup, yearGroup, dueDate, subject, content) {
    // Get the list of TPs in a TD group
    const tpGroups = await TpGroupModel.find({ tdGroup, yearGroup })
    const tpGroupsName = tpGroups.map(x => x.name.toLowerCase())

    // Check some TP groups were found
    if (tpGroups.length === 0)
      throw new Error(msgId.UNKNOWN_GROUP_TD(tdGroup, yearGroup))

    // Check the message was sent in one of the TP groups channel
    if (!tpGroups.some(aTpGroup => isMessageInChannel(message, aTpGroup.name)))
      throw new Error(msgId.NOT_IN_CHANNEL(...tpGroupsName))

    // Check the author has one of the TP groups role
    if (!(await hasAuthorRoleSome(message, ...tpGroups.map(x => x.name))))
      throw new Error(msgId.MISSING_ROLE_SOME(tpGroupsName))

    // Check the dueDate is a valid date
    const parsedDueDate = Date.parse(dueDate)
    if (isNaN(parsedDueDate)) throw new Error(msgId.INVALID_DATE)

    // Check the dueDate is in the future
    if (parsedDueDate < Date.now()) throw new Error(msgId.DATE_IN_PAST)

    // Add the homework to the TP groups
    const homework: Homework = {
      authorId: message.author.id,
      subject,
      content,
      dueDate: new Date(parsedDueDate)
    }

    await TpGroupModel.updateMany({ _id: { $in: tpGroups.map(x => x._id) } },
      { $push: { homework } },
      { runValidators: true, new: true })

    // Send a message to tp groups to notify
    const channels = message.guild.channels.filter(aChannel => tpGroupsName.includes(aChannel.name.toLowerCase()))
    for (const aChannel of channels.values()) {
      if (aChannel instanceof TextChannel)
        await aChannel.send(msgId.HOMEWORK_ADDED_VIA_TD(homework, aChannel.name, message.author.id))
    }
  }
}
export default command
