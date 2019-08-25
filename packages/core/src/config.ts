import path from 'path'
import dotenvSafe from 'dotenv-safe'

// Load environment configuration
dotenvSafe.config({
  path: path.resolve(__dirname, '..', '..', '..', '.env'),
  example: path.resolve(__dirname, '..', '..', '..', '.env.example')
})

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
  EXO_PLATFORM_PASSWORD,
  SERVER_PORT,
  SERVER_SECRET,
  DISCORD_REDIRECT_URI,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET
} = <{ [key: string]: string }>process.env
