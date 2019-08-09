import fetch from 'node-fetch'
import boom from '@hapi/boom'
import { User, GuildMember } from 'discord.js'

import { getGuildMember } from '../bot'

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


