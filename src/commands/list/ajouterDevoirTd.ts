import { TextChannel } from 'discord.js'
import { Command } from '../types'
import { isMessageInChannel, toHumanDate, hasAuthorRoleSome } from '../utils'
import msgId from '../../msgId'
import { ARG_SEPARATOR as s, COMMAND_TRIGGER as t } from '../../config'
import { TpGroupModel, Homework } from '../../database/TpGroup'

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

  async run(message, ...[tdGroup, yearGroup, dueDate, subject, content]) {
    // Get the list of TPs in a TD group
    const tpGroups = (await TpGroupModel.find({ tdGroup, yearGroup }))
    const tpGroupsName = tpGroups.map(x => x.name.toLowerCase())

    // Check some TP groups were found
    if (tpGroups.length === 0)
      throw new Error(msgId.UNKNOWN_GROUP_TD(tdGroup, yearGroup))

    // Check the message was sent in one of the TP groups channel
    if (!tpGroups.some(aTpGroup => isMessageInChannel(message, aTpGroup.name)))
      throw new Error(msgId.NOT_IN_CHANNEL(tpGroupsName.join(', ')))

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
    TpGroupModel.find
    await TpGroupModel.updateMany({ _id: { $in: tpGroups.map(x => x._id) } },
      { $push: { homework } },
      { runValidators: true, new: true })

    // Send a message to tp groups to notify
    const channels = message.guild.channels.filter(aChannel => tpGroupsName.includes(aChannel.name.toLowerCase()))

    for (const aChannel of channels.values()) {
      if (aChannel instanceof TextChannel)
        await aChannel.send(`Un devoir pour le \`${toHumanDate(homework.dueDate)}\` du cours \`${homework.subject}\` a été ajouté au groupe de TP \`${aChannel.name}\` par <@${message.author.id}> (ajout de devoir via groupe de TD).\`\`\`${homework.content}\`\`\``)
    }
  }
}
export default command
