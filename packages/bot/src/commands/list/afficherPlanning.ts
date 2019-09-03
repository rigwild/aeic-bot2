import { RichEmbed } from '@aeic-bot2/core/dist/types'

import { getDateWeek } from '@aeic-bot2/common'
import { config, msgId, utilsCore, TpGroupModel } from '@aeic-bot2/core'
const { COMMAND_TRIGGER: t, PLANNING_LINK } = config
const { hasAuthorRole, planningIutLoader, tpGroupExists } = utilsCore

import { Command } from '../types'

export const buildPlanningEmbed = (group: string, planningData: { screenDate: string, screenPath: string }) => {
  let embed = new RichEmbed()
  embed.title = `Planning du groupe \`${group}\` pour la semaine \`${getDateWeek(new Date(planningData.screenDate))}\``
  embed.footer = { text: 'Date de mise en cache', icon_url: 'https://planning-iut-calais.asauvage.fr/favicon/favicon-32x32.png' }
  embed.timestamp = new Date(planningData.screenDate)
  embed.image = { url: `${PLANNING_LINK}${planningData.screenPath}?nonce=${Date.now()}` }
  embed.url = `${PLANNING_LINK}${planningData.screenPath}`
  return embed
}

const command: Command = {
  meta: {
    command: 'afficherPlanning',
    minArgs: 0,
    maxArgs: 1,
    description: `Afficher le planning d\'un groupe. **Commande utilisable sans paramètres dans un channel de TP**. Voir : <a href="${PLANNING_LINK}" target="_blank" rel="noopener">${PLANNING_LINK}</a>.`,
    examples: [
      // !afficherPlanning tp1a
      `${t}afficherPlanning`,
      `${t}afficherPlanning tp1a`,
      `${t}afficherPlanning DUT1 TPA`,
      `${t}afficherPlanning DUT2 TD2`,
      `${t}afficherPlanning Apprentis info S4`
    ]
  },

  async run(message, ...args) {
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
      if (!tpGroupData || !tpGroupData.planningGroup)
        throw new Error(msgId.UNKNOWN_GROUP_TP_PLANNING_GROUP(group))

      groupPlanningToLoad = tpGroupData.planningGroup
    }
    // An argument was passed, check its planning
    else groupPlanningToLoad = args[0]

    // Send a loading message in the channel if the request is not cached
    if (!planningIutLoader.isCached()) await message.channel.send(msgId.REQUEST_LOADING('afficherPlanning'))

    const planningData = (await planningIutLoader.getGroup(groupPlanningToLoad))[0]
    await message.reply({ embed: buildPlanningEmbed(groupPlanningToLoad, planningData) })
  }
}
export default command
