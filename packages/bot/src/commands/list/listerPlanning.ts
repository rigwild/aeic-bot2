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
    maxArgs: 1,
    description: `Lister les plannings disponibles. Ajouter un chiffre en paramètre aura pour effet de sélectionner la semaine à appliquer (1: semaine actuel, 2: semaine prochaine, jusque 4). Voir : <a href="${PLANNING_LINK}" target="_blank" rel="noopener">${PLANNING_LINK}</a>.`,
    examples: [
      // !listerPlanning
      `${t}listerPlanning`,
      `${t}listerPlanning 1`,
      `${t}listerPlanning 2`,
      `${t}listerPlanning 3`,
      `${t}listerPlanning 4`
    ]
  },

  async run(message, weekStr = '1') {
    const week = parseInt(weekStr, 10)
    if (![1, 2, 3, 4].some(x => x === week)) throw new Error(msgId.INVALID_WEEK_NUMBER)
    const usedWeek = <1 | 2 | 3 | 4>week

    // Send a loading message in the channel if the request is not cached
    const loadingMessage = !planningIutLoader.isCached()
      ? message.channel.send(msgId.REQUEST_LOADING_THEN_CACHED('listerPlanning')).then(() => { })
      : Promise.resolve()

    // Get list of classes with its planning data
    let [classesList] = await Promise.all([planningIutLoader.getClassesList(), loadingMessage])

    // Build the embed
    let embed = new RichEmbed()
    const lastCache = new Date(classesList[0].weeks[usedWeek].screenDate)
    const weekNumber = getDateWeek(lastCache) - 1 + usedWeek
    embed.title = `Liste des plannings disponibles pour la semaine \`${weekNumber}\``
    embed.footer = { text: 'Date de mise en cache', icon_url: 'https://planning-iut-calais.asauvage.fr/favicon/favicon-32x32.png' }
    embed.timestamp = lastCache

    // Add group fields with link to planning
    // Embed can't have more than 25 fields, make 25 fields and the rest in description
    if (classesList.length > 25) {
      const tooMuch = classesList.length - 25
      console.log(classesList.length)
      console.log(tooMuch)
      embed.fields = classesList.slice(tooMuch).map(aClass => ({ name: aClass.class.substring(0, 20), value: `[Planning link](${PLANNING_LINK}${aClass.weeks[usedWeek].screenPath})`, inline: true }))
      embed.description = classesList.slice(0, tooMuch).map(aClass => `[${aClass.class.substring(0, 35)}](${PLANNING_LINK}${aClass.weeks[usedWeek].screenPath})`).join('\n')
    }
    else
      embed.fields = classesList.map(aClass => ({ name: aClass.class.substring(0, 20), value: `[Planning link](${PLANNING_LINK}${aClass.weeks[usedWeek].screenPath})`, inline: true }))

    await message.reply({ embed })
  }
}
export default command
