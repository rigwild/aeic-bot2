import ExoPlatformWrapper from 'exoplatform-api-wrapper'

import { User } from 'exoplatform-api-wrapper/dist/types/User'
import { EXO_PLATFORM_LINK, EXO_PLATFORM_USERNAME, EXO_PLATFORM_PASSWORD } from '../../config'
import { removeAccents } from '.'
import msgId from '../../msgId'

class ExoPlatformLoader {
  private cache: User[] = []
  private cacheLastUpdate: Date | null = null

  private exoWrapper: ExoPlatformWrapper
  private loggedIn: boolean = false

  constructor() {
    this.exoWrapper = new ExoPlatformWrapper(EXO_PLATFORM_LINK, undefined, 'TLSv1_method')
  }

  /**
   * Log the bot in
   */
  private async login() {
    if (!this.loggedIn) {
      await this.exoWrapper.login(EXO_PLATFORM_USERNAME, EXO_PLATFORM_PASSWORD)
        .catch(() => {
          throw new Error(msgId.UNREACHABLE_HOST(EXO_PLATFORM_LINK))
        })
      this.loggedIn = true
    }
  }

  /** Check if data was cached less than 4 hours ago */
  isCached() { return !!this.cacheLastUpdate && this.cacheLastUpdate > new Date(Date.now() - 1000 * 60 * 60 * 4) }
  /** Get last cache timestamp */
  getCacheLastUpdate() { return this.cacheLastUpdate }


  /**
   * Load eXo Platform's users. Will grab from cache and refresh it every 4 hours.
   */
  async loadUsers(): Promise<User[]> {
    if (!this.loggedIn) await this.login()
    if (!this.isCached()) {
      const { users } = await this.exoWrapper.user.list(99999)
        .catch(() => {
          throw new Error(msgId.UNREACHABLE_HOST(EXO_PLATFORM_LINK))
        })
      this.cache = users
      this.cacheLastUpdate = new Date()
    }
    return this.cache
  }

  /**
   * Find all users containing a string. Will search for the full name, the username and the email.
   * Case insensitive.
   * @param search The user to find. Must be 2 chars minimum
   */
  async searchUser(search: string) {
    // Check the string is 2 chars minimum
    if (search.length < 2) throw new Error(msgId.INVALID_STR_SIZE(search, 2))

    // Find list of users matching the string
    const users = await this.loadUsers()
    const regex = new RegExp(search, 'gi')
    return users.filter(aUser => [aUser.fullname, aUser.username, aUser.email].some(x => typeof x === 'string' && removeAccents(x) && x.match(regex)))
  }
}

export default new ExoPlatformLoader()
