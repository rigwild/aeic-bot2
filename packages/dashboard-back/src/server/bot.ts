import fetch from 'node-fetch'
import boom from '@hapi/boom'

import { bot, config } from '@aeic-bot2/core'
const { DISCORD_SERVER_ID } = config
import { Guild, User, GuildMember } from '@aeic-bot2/core/dist/types'

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
