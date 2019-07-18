import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const p = process.env
if (!p.DISCORD_AUTH_TOKEN || !p.MONGO_URI)
  throw new Error('You must specify your configuration as environment variables to run the bot (DISCORD_AUTH_TOKEN, MONGO_URI).')

export const { DISCORD_AUTH_TOKEN, MONGO_URI } = p
export const COMMAND_TRIGGER = '!'
export const ARG_SEPARATOR = '--'
export const SERVER_ID = '476179989348483082'
// export const SERVER_ID = '327121464996134922'
export const DEV_DISCORD_ID = '411139773940629514'
export const DOC_URI = 'https://rigwild.github.io/aeic-bot2 (TODO)'
