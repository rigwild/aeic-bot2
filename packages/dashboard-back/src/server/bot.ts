import Discord, { Guild } from 'discord.js'

import { DISCORD_AUTH_TOKEN, DISCORD_SERVER_ID } from '../config'

// Create the bot instance
export const bot = new Discord.Client()

export const start = () => new Promise(resolve => {
  console.log('Starting AEIC-BOT...')

  bot.login(DISCORD_AUTH_TOKEN)

  bot.on('ready', () => {
    const serverInfo = bot.guilds.find(x => x.id === DISCORD_SERVER_ID)
    if (!serverInfo) throw new Error(`The server ID=${DISCORD_SERVER_ID} was not found. Check the bot has access to it.`)
    console.log(`Bot connected on the server "${serverInfo.name}" ID=${DISCORD_SERVER_ID}.`)
    resolve()
  })
})

export const getGuild = () => <Guild>bot.guilds.get(DISCORD_SERVER_ID)
export const getUser = async (userId: string) => bot.fetchUser(userId).then(user => getGuild().member(user))
