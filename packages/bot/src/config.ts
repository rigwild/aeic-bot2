import path from 'path'
import dotenv from 'dotenv'
import winston from 'winston'

// Winston logger configuration
const errorStackFormat = winston.format(info => info instanceof Error
  ? Object.assign({}, info, { message: info.message, stack: info.stack })
  : info)
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    errorStackFormat(),
    winston.format.json(),
    winston.format.timestamp()
  ),
  transports: [
    new winston.transports.File({ filename: path.resolve(__dirname, '..', 'server.log') }),
    new winston.transports.File({ filename: path.resolve(__dirname, '..', 'server.error.log'), level: 'error' }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.json()
    })
  ],
  exitOnError: false
})

// Load environment configuration
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const requiredVariables = [
  'COMMAND_TRIGGER',
  'ARG_SEPARATOR',
  'DEV_DISCORD_ID',
  'DOC_URI',
  'PLANNING_LINK',
  'EXO_PLATFORM_LINK',
  'AUTO_REMINDER_CRON_TIME',
  'DISCORD_AUTH_TOKEN',
  'DISCORD_SERVER_ID',
  'MONGO_URI',
  'EXO_PLATFORM_USERNAME',
  'EXO_PLATFORM_PASSWORD'
]

if (!requiredVariables.every(x => process.env[x]))
  throw new Error(`You must specify your configuration as environment variables to run the bot (${requiredVariables.join(', ')}).`)

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
