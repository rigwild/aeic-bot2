import { connectDb } from '@aeic-bot2/core'

import botStart from './bot'
import reminderService from './reminderService'

const setup = async () => {
  // Connect to the database and init its content
  await connectDb()

  // Start the bot
  await botStart()

  // Start the reminder service
  reminderService()
  console.info('The reminder service was started')
}

setup()
