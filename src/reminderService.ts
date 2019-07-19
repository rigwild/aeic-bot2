import { CronJob } from 'cron'
import { AUTO_REMINDER_CRON_TIME, SERVER_ID, logger } from './config'
import { bot } from './bot'
import msgId from './msgId'
import { TpGroupModel } from './database/TpGroup'
import { TextChannel } from 'discord.js'

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
      // Check the TP group channel exists
      const channel = guild.channels.find(aChannel => aChannel.name === aTpGroup.name)
      if (!channel || !(channel instanceof TextChannel))
        throw new Error(msgId.UNKNOWN_CHANNEL(aTpGroup.name))

      // Keep only homework that are due in the future
      const dateMin = new Date(Date.now() + -1 * 24 * 3600 * 1000)
      const homeworks = aTpGroup.homework
        ? aTpGroup.homework.filter(aHomework => dateMin < aHomework.dueDate)
        : []

      // Build the message that will be sent
      let msg = `Rappel journalier des devoirs pour le groupe ${aTpGroup.name} :\n\n`
      if (homeworks.length === 0) msg += msgId.NO_HOMEWORK(aTpGroup.name)
      else msg += homeworks.map(aHomework => msgId.HOMEWORK_SHOW(aHomework)).join('\n')

      await channel.send(msg)
    }
    catch (error) {
      logger.error(error)
    }
  }
  logger.info(`Reminder process ended`)
}, undefined, true, 'Europe/Paris', undefined, false)
