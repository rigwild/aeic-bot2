import { start as botStart } from './bot'
import connectDb from './database'
import { logger } from './config'
import reminderService from './reminderService'

const setup = async () => {
  // Connect to the database and init its content
  await connectDb()

  // Start the bot
  await botStart()

  // Start the reminder service
  reminderService()
  logger.info('The reminder service was started')
}

setup()
