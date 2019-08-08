import path from 'path'
import dotenvSafe from 'dotenv-safe'

// Load environment configuration
dotenvSafe.config({ path: path.resolve(__dirname, '..', '.env') })

export const {
  SERVER_PORT,
  SERVER_SECRET,
  DISCORD_AUTH_TOKEN,
  DISCORD_SERVER_ID,
  MONGO_URI,
  DISCORD_REDIRECT_URI,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET
} = <{ [key: string]: string }>process.env

export const dbPath = path.resolve(__dirname, '..', 'aeic-bot2-dashboard.db')
