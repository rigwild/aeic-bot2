import dotenvSafe from 'dotenv-safe'
dotenvSafe.config({ example: 'default.env' })

export const {
  SERVER_PORT,
  SERVER_SECRET,
  DISCORD_AUTH_TOKEN,
  DISCORD_SERVER_ID,
  MONGO_URI,
  DISCORD_REDIRECT_URI,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET
} = process.env
