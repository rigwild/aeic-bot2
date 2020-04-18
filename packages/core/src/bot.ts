import Discord from 'discord.js'

import { DISCORD_AUTH_TOKEN, DISCORD_SERVER_ID, COMMAND_TRIGGER, DASHBOARD_URI } from './config'

// Create the bot instance
export const bot = new Discord.Client() as Discord.Client

/** Start the bot */
export const botStart = (): Promise<void> =>
  new Promise(resolve => {
    console.info('Starting AEIC-BOT2 ...')

    bot.login(DISCORD_AUTH_TOKEN)

    bot.on('ready', () => {
      const serverInfo = bot.guilds.cache.find(x => x.id === DISCORD_SERVER_ID)
      if (!serverInfo)
        throw new Error(`The server ID=${DISCORD_SERVER_ID} was not found. Check the bot has access to it.`)
      console.info(`Bot connected on the server "${serverInfo.name}" ID=${DISCORD_SERVER_ID}.`)
      bot.user?.setActivity(`Tape ${COMMAND_TRIGGER}aide 😉`)
      resolve()
    })
  })
