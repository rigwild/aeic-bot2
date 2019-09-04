import { bot, botStart, msgId, config } from '@aeic-bot2/core'
const { COMMAND_TRIGGER, DISCORD_SERVER_ID } = config
import { TextChannel } from '@aeic-bot2/core/dist/types'

import { DiscordMessageForcedTextChannel } from './commands/types'
import { commandLoader } from './commands'

/** Start the bot */
export default async () => {
  await botStart()

  // Check if new message contained a command, then execute it
  bot.on('message', message => {
    if (message.guild
      && message.guild.id === DISCORD_SERVER_ID
      && message.content.trim().startsWith(COMMAND_TRIGGER)
      && message.channel instanceof TextChannel)
      return commandLoader(<DiscordMessageForcedTextChannel>message)
  })

  // Send a message when a member joins the server
  bot.on('guildMemberAdd', async member => {
    if (member.guild.id !== DISCORD_SERVER_ID) return
    try {
      await member.send(msgId.WELCOME_DM)
      await member.guild.defaultChannel.send(msgId.WELCOME_PUBLIC(member.id))
    }
    catch (error) {
      console.error(error)
    }
  })
}
