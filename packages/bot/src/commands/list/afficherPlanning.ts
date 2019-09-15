import { RichEmbed } from '@aeic-bot2/core/dist/types'

import { getDateWeek, defaultTpGroups } from '@aeic-bot2/common'
import { config, msgId, utilsCore } from '@aeic-bot2/core'
const { COMMAND_TRIGGER: t, PLANNING_LINK } = config
const { planningIutLoader, tpGroupExists, isWeekEnd } = utilsCore

import { Command } from '../types'

export const buildPlanningEmbed = (group: string, planningData: { screenDate: string, screenPath: string }) => {
  let embed = new RichEmbed()

  embed.title = `Planning du groupe \`${group}\` pour la semaine \`${getDateWeek(new Date(planningData.screenDate)) + (isWeekEnd() ? 1 : 0)}\``
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
      `${t}afficherPlanning 1tpa`,
      `${t}afficherPlanning 2tpd`,
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
        throw new Error(msgId.UNKNOWN_GROUP_TP(group))

      // Get the TP's planning group
      const tpGroupData = defaultTpGroups.find(x => x.name === group.toLowerCase())
      if (!tpGroupData || !tpGroupData.planningGroup)
        throw new Error(msgId.UNKNOWN_GROUP_TP_PLANNING_GROUP(group))

      groupPlanningToLoad = tpGroupData.planningGroup
    }
    // An argument was passed, check its planning
    else {
      const argGroup = groupPlanningToLoad = args[0]

      // Check if the argGroup is a TP group
      const tpGroupData = defaultTpGroups.find(x => x.name === argGroup.toLowerCase())
      // If it is a TP group, get the corresponding planning group. Else put the raw argument
      groupPlanningToLoad = tpGroupData && tpGroupData.planningGroup ? tpGroupData.planningGroup : args[0]
    }

    // Send a loading message in the channel if the request is not cached
    const loadingMessage = !planningIutLoader.isCached()
      ? message.channel.send(msgId.REQUEST_LOADING_THEN_CACHED('afficherPlanning')).then(() => { })
      : Promise.resolve()

    // Get list of classes with its planning data
    const [planningDataAll] = await Promise.all([planningIutLoader.getGroup(groupPlanningToLoad), loadingMessage])

    const weekDayNumber = new Date().getDay()

    const planningData = weekDayNumber === 6 || weekDayNumber === 7 ? planningDataAll[1] : planningDataAll[0]
    await message.reply({ embed: buildPlanningEmbed(groupPlanningToLoad, planningData) })
  }
}
export default command
