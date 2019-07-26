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

const p = process.env
if (!p.DISCORD_AUTH_TOKEN || !p.MONGO_URI || !p.EXO_PLATFORM_USERNAME || !p.EXO_PLATFORM_PASSWORD)
  throw new Error('You must specify your configuration as environment variables to run the bot (DISCORD_AUTH_TOKEN, MONGO_URI, EXO_PLATFORM_USERNAME, EXO_PLATFORM_PASSWORD).')

export const { DISCORD_AUTH_TOKEN, MONGO_URI, EXO_PLATFORM_USERNAME, EXO_PLATFORM_PASSWORD } = p
export const COMMAND_TRIGGER = '!'
export const ARG_SEPARATOR = '--'
export const SERVER_ID = '476179989348483082' // '327121464996134922'
export const DEV_DISCORD_ID = '411139773940629514'
export const DOC_URI = 'https://rigwild.github.io/aeic-bot2 (TODO)'
export const PLANNING_LINK = 'https://planning-iut-calais.asauvage.fr'
export const EXO_PLATFORM_LINK = 'iut.univ-littoral.fr'

export const AUTO_REMINDER_CRON_TIME = '0 19 * * *'