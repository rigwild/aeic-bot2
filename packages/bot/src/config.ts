import path from 'path'
import dotenvSafe from 'dotenv-safe'

// Load environment configuration
dotenvSafe.config({ path: path.resolve(__dirname, '..', '.env') })

export const {
  COMMAND_TRIGGER,
  ARG_SEPARATOR,
  DEV_DISCORD_ID,
  DOC_URI,
  PLANNING_LINK,
  EXO_PLATFORM_LINK,
  AUTO_REMINDER_CRON_TIME,
  DISCORD_AUTH_TOKEN,
  DISCORD_SERVER_ID,
  MONGO_URI,
  EXO_PLATFORM_USERNAME,
  EXO_PLATFORM_PASSWORD
} = <{ [key: string]: string }>process.env
