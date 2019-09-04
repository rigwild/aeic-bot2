import { RichEmbed } from '@aeic-bot2/core/dist/types'

import { getDateWeek } from '@aeic-bot2/common'
import { config, msgId, utilsCore } from '@aeic-bot2/core'
const { COMMAND_TRIGGER: t, PLANNING_LINK } = config
const { planningIutLoader } = utilsCore

import { Command } from '../types'

const command: Command = {
  meta: {
    command: 'listerPlanning',
    minArgs: 0,
    maxArgs: 0,
    description: `Lister les plannings disponibles. Voir : <a href="${PLANNING_LINK}" target="_blank" rel="noopener">${PLANNING_LINK}</a>.`,
    examples: [
      // !listerPlanning
      `${t}listerPlanning`
    ]
  },

  async run(message) {
    // Send a loading message in the channel if the request is not cached
    if (!planningIutLoader.isCached()) await message.channel.send(msgId.REQUEST_LOADING_THEN_CACHED('listerPlanning'))

    // Get list of classes with its planning data
    const classesList = await planningIutLoader.getClassesList()

    // Build the embed
    let embed = new RichEmbed()
    const lastCache = new Date(classesList[0].weeks[1].screenDate)
    console.log(lastCache)
    const weekNumber = getDateWeek(lastCache)
    embed.title = `Liste des plannings disponibles pour la semaine \`${weekNumber}\``
    embed.footer = { text: 'Date de mise en cache', icon_url: 'https://planning-iut-calais.asauvage.fr/favicon/favicon-32x32.png' }
    embed.timestamp = lastCache
    // Add group fields with link to planning
    embed.fields = classesList.map(aClass => ({ name: aClass.class.substring(0, 20), value: `[Planning link](${PLANNING_LINK}${aClass.weeks[1].screenPath})`, inline: true }))

    await message.reply({ embed })
  }
}
export default command
