import { CronJob } from 'cron'

import { toHumanDate } from '@aeic-bot2/common'
import { config, bot, msgId, utilsCore } from '@aeic-bot2/core'
import { COMMAND_TRIGGER, DASHBOARD_URI } from '@aeic-bot2/core/dist/config'
import { TpGroupModel, TpGroupDocument } from '@aeic-bot2/core/dist/database/TpGroup'
const { AUTO_REMINDER_CRON_TIME, DISCORD_SERVER_ID } = config
const { planningIutLoader } = utilsCore
import { TextChannel } from '@aeic-bot2/core/dist/types'

import { buildHomeworkEmbed } from './commands/list/afficherDevoir'
import { buildPlanningEmbed } from './commands/list/afficherPlanning'

/**
 * Remind a TP group of its homework
 * @param channel TP group remind channel
 * @param tpGroup TP group to remind
 */
const homeworkRemind = (channel: TextChannel, tpGroup: TpGroupDocument) => {
  // Keep only homework that are due in the future
  const dateMin = new Date(Date.now() + -1 * 24 * 3600 * 1000)
  const homework = tpGroup.homework ? tpGroup.homework.filter(aHomework => dateMin < aHomework.dueDate) : []

  // Build the message that will be sent
  return channel.send(buildHomeworkEmbed(tpGroup.name, homework))
}

/**
 * Remind a TP group of its homework
 * @param channel TP group remind channel
 * @param tpGroup TP group to remind
 */
const planningRemind = async (channel: TextChannel, tpGroup: TpGroupDocument) => {
  if (!tpGroup.planningGroup) return

  const weekDayNumber = new Date().getDay()
  const planningData = (await planningIutLoader.getGroup(tpGroup.planningGroup))[weekDayNumber === 6 || weekDayNumber === 7 ? 0 : 1]
  return channel.send(buildPlanningEmbed(tpGroup.name, planningData))
}

/**
 * Starts the reminder service everyday at 19:00
 * You must have started the bot before
 */
export default () => new CronJob(AUTO_REMINDER_CRON_TIME, async () => {
  console.info(`Reminder process started`)
  // Get the guild
  const guild = bot.guilds.get(DISCORD_SERVER_ID)
  if (!guild) return

  // Get all TP groups documents
  const tpGroups = await TpGroupModel.find()
  for (const aTpGroup of tpGroups) {
    try {
      if (!aTpGroup.remindChannel) continue

      // Check the TP group remind channel exists
      const channel = guild.channels.find(aChannel => aChannel.name === aTpGroup.remindChannel)

      if (!channel || !(channel instanceof TextChannel))
        throw new Error(msgId.UNKNOWN_CHANNEL(aTpGroup.remindChannel))

      await channel.send(`**RAPPEL JOURNALIERS DU ${toHumanDate(new Date())} pour le groupe \`${aTpGroup.name}\`**\n`
        + `Tu peux muter ce channel si je te spam : \`[✅] Mute #${aTpGroup.name}-remind\`\n\n`
        + `Lien du dashboard : ${DASHBOARD_URI}\n`
        + `Rappel des commandes relatives aux groupes de TP :\`\`\`\n\n`
        + `Lister les desvoirs :\n${COMMAND_TRIGGER}afficherDevoir\n\n`
        + `Ajouter un devoir :\n${COMMAND_TRIGGER}ajouterDevoir 2021-10-21 -- Algorithmique-- TP sur les boucles\n\n`
        + `Afficher le planning :\n${COMMAND_TRIGGER}afficherPlanning\n`
        + `Trouver quelqu'un sur ExoPlatform :\n${COMMAND_TRIGGER}trouverPersonne antoine sauvage`
        + `\n\`\`\``)

      // Remind of the homework
      await homeworkRemind(channel, aTpGroup)
      // Remind of the planning
      await planningRemind(channel, aTpGroup)
    }
    catch (error) {
      console.error(error)
    }
  }
  console.info('Reminder process ended')
}, undefined, true, 'Europe/Paris', undefined, false)
