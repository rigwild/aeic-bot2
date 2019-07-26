import { TextChannel } from 'discord.js'

import { Command } from '../types'
import { hasAuthorRole, planningIutLoader, tpGroupExists } from '../utils'
import msgId from '../../msgId'
import { COMMAND_TRIGGER as t, PLANNING_LINK } from '../../config'
import { TpGroupModel } from '../../database/TpGroup'

const command: Command = {
  meta: {
    command: 'afficherPlanning',
    minArgs: 0,
    maxArgs: 1,
    description: `Afficher le planning d\'un groupe. Voir : <a href="${PLANNING_LINK}" target="_blank" rel="noopener">${PLANNING_LINK}</a>`,
    examples: [
      // !afficherPlanning tp1a
      `${t}afficherPlanning tp1a`,
      `${t}afficherPlanning DUT1 TPA`,
      `${t}afficherPlanning DUT2 TD2`,
      `${t}afficherPlanning Apprentis info S4`
    ]
  },

  async run(message, ...args) {
    if (!(message.channel instanceof TextChannel)) return

    let groupPlanningToLoad
    // No arguments passed, check the channel name the command was sent in
    if (args.length === 0) {
      const group = message.channel.name
      // Check the message was sent in a TP group channel
      if (!tpGroupExists(group))
        throw new Error(msgId.NOT_IN_TP_CHANNEL)

      // Check the author has the TP group role
      if (!(await hasAuthorRole(message, group)))
        throw new Error(msgId.MISSING_ROLE(group))

      // Get the TP's planning group
      const tpGroupData = await TpGroupModel.findOne({ name: group.toLowerCase() })
        .exec()
        .catch(() => {
          throw new Error(msgId.UNKNOWN_GROUP_TP(group))
        })
      if (!tpGroupData || !tpGroupData.planningGroup)
        throw new Error(msgId.UNKNOWN_GROUP_TP_PLANNING_GROUP(group))

      groupPlanningToLoad = tpGroupData.planningGroup
    }
    // An argument was passed, check its planning
    else groupPlanningToLoad = args[0]

    // Send a loading message in the channel if the request is not cached
    if (!planningIutLoader.isCached()) await message.channel.send(msgId.REQUEST_LOADING('afficherPlanning'))

    const planningData = (await planningIutLoader.getGroup(groupPlanningToLoad))[0]
    await message.reply(msgId.PLANNING_SHOW(groupPlanningToLoad, new Date(planningData.screenDate)), {
      file: `${PLANNING_LINK}${planningData.screenPath}`
    })
  }
}
export default command
