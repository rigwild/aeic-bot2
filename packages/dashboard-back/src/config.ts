import path from 'path'
import dotenvSafe from 'dotenv-safe'

// Load environment configuration
dotenvSafe.config({
  path: path.resolve(__dirname, '..', '..', '..', '.env'),
  example: path.resolve(__dirname, '..', '..', '..', '.env.example')
})

export const {
  SERVER_PORT,
  SERVER_SECRET,
  DISCORD_AUTH_TOKEN,
  DISCORD_SERVER_ID,
  MONGO_URI,
  DISCORD_REDIRECT_URI,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  PLANNING_LINK
} = <{ [key: string]: string }>process.env
