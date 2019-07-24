import { TextChannel } from 'discord.js'
import { CronJob } from 'cron'

import { AUTO_REMINDER_CRON_TIME, SERVER_ID, PLANNING_LINK, logger } from './config'
import { bot } from './bot'
import msgId from './msgId'
import planningIut from './commands/utils/planningIut'
import { TpGroupModel, TpGroupDocument } from './database/TpGroup'

/**
 * Remind a TP group of its homework
 * @param channel TP group remind channel
 * @param tpGroup TP group to remind
 */
const homeworkRemind = (channel: TextChannel, tpGroup: TpGroupDocument) => {
  // Keep only homework that are due in the future
  const dateMin = new Date(Date.now() + -1 * 24 * 3600 * 1000)
  const homeworks = tpGroup.homework ? tpGroup.homework.filter(aHomework => dateMin < aHomework.dueDate) : []

  // Build the message that will be sent
  return channel.send(`Rappel journalier des devoirs pour le groupe ${tpGroup.name} :\n${homeworks.length === 0
    ? msgId.NO_HOMEWORK(tpGroup.name)
    : homeworks.map(aHomework => msgId.HOMEWORK_SHOW(aHomework)).join('\n')}`)
}

/**
 * Remind a TP group of its homework
 * @param channel TP group remind channel
 * @param tpGroup TP group to remind
 */
const planningRemind = async (channel: TextChannel, tpGroup: TpGroupDocument) => {
  if (!tpGroup.planningGroup) return
  const planningData = (await planningIut.getGroup(tpGroup.planningGroup))[0]
  return channel.send(`Rappel journalier du planning pour le groupe ${tpGroup.name} :\n${msgId.PLANNING_SHOW(tpGroup.name, new Date(planningData.screenDate))}`, {
    file: `${PLANNING_LINK}${planningData.screenPath}`
  })
}

/**
 * Starts the reminder service everyday at 19:00
 * You must have started the bot before
 */
export default () => new CronJob(AUTO_REMINDER_CRON_TIME, async () => {
  logger.info(`Reminder process started`)
  // Get the guild
  const guild = bot.guilds.get(SERVER_ID)
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

      // Remind of the planning
      await planningRemind(channel, aTpGroup)
      // Remind of the homework
      await homeworkRemind(channel, aTpGroup)
    }
    catch (error) {
      logger.error(error)
    }
  }
  logger.info(`Reminder process ended`)
}, undefined, true, 'Europe/Paris', undefined, true)
