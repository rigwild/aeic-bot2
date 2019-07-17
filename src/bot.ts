import Discord from 'discord.js'

import { DISCORD_AUTH_TOKEN, COMMAND_TRIGGER, SERVER_ID } from './config'
import msgId from './msgId'
import runCommand from './commands'

export default () => {
  console.log('Starting AEIC-BOT...')

  // Connect the bot
  const bot = new Discord.Client()
  bot.login(DISCORD_AUTH_TOKEN)

  bot.on('ready', () => {
    const serverInfo = bot.guilds.find(x => x.id === SERVER_ID)
    if (!serverInfo) throw new Error(`The server ID=${SERVER_ID} was not found. Check the bot has access to it.`)
    console.log(`Bot connected on the server "${serverInfo.name}" ID=${SERVER_ID}.`)
  })

  // Check if new message contained a command, then execute it
  bot.on('message', async message => {
    if (message.guild.id !== SERVER_ID || !message.content.trim().startsWith(COMMAND_TRIGGER)) return
    try {
      await runCommand(message)
    }
    catch (err) {
      message.reply(err.message)
    }
  })

  // Send a message when a member joins the server
  bot.on('guildMemberAdd', async member => {
    if (member.guild.id !== SERVER_ID) return
    try {
      await member.send(msgId.WELCOME_DM)
      await member.guild.defaultChannel.send(msgId.WELCOME_PUBLIC(member.id))
    }
    catch (err) {
      console.error(err)
    }
  })
}
