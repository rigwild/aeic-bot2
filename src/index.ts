import { start as botStart } from './bot'
import connectDb from './database'
import reminderService from './reminderService'

const setup = async () => {
  // Connect to the database and init its content
  await connectDb()

  // Start the bot
  await botStart()

  // Start the reminder service
  reminderService()
}

setup()
