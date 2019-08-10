import Discord, { Guild, User, GuildMember } from 'discord.js'
import fetch from 'node-fetch'
import boom from '@hapi/boom'

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

/**
 * Fetch the Discord's guild the bot is watching
 * @returns Data of the Discord guild
 */
export const getGuild = () => <Guild>bot.guilds.get(DISCORD_SERVER_ID)

/**
 * Fetch a Discord's guild member data
 * @param userId Targetted user ID
 * @returns Data of the Discord user
 */
export const getGuildMember = async (userId: string) => bot.fetchUser(userId).then(user => getGuild().member(user))

/**
 * Extract useful profile data from a member
 * @param member Discord guild member
 */
export const extractMemberProfile = (member: GuildMember) => ({
  id: member.id,
  username: member.user.username,
  displayName: member.displayName,
  displayHexColor: member.displayHexColor,
  discriminator: member.user.discriminator,
  avatarURL: member.user.avatarURL,
  highestRole: { name: member.highestRole.name, hexColor: member.highestRole.hexColor },
  roles: member.roles.map(aRole => aRole.name)
})

/**
 * Get a Discord user profile
 * @param accessToken User access token
 * @returns Profile data
 * @throws Invalid data was received
 * @throws The user is not a Discord member
 */
export const getDiscordUserProfile = async (accessToken: string) => {
  // Load user data
  const me: User = await fetch('https://discordapp.com/api/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  }).then(_res => _res.json())

  // Check data is valid
  if (!me.id) throw boom.internal('Invalid data was collected.')

  const member = await getGuildMember(me.id)
  if (!member) throw boom.internal('Your Discord account was not found in the AEIC server.')

  return extractMemberProfile(member)
}
