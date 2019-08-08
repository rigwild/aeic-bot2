import fetch from 'node-fetch'

import { PLANNING_LINK } from '../../config'
import msgId from '../../msgId'

interface PlanningClasses {
  classes: {
    [group: string]: {
      class: string
      weeks: {
        [key in '1' | '2' | '3' | '4']: {
          screenPath: string
          screenDate: string
        }
      }
    }
  }
}

class PlanningIutLoader {
  private cache: PlanningClasses = { classes: {} }
  private cacheLastUpdate: Date | null = null

  /** Check if data was cached less than 4 hours ago */
  isCached() { return !!this.cacheLastUpdate && this.cacheLastUpdate > new Date(Date.now() - 1000 * 60 * 60 * 4) }
  /** Get last cache timestamp */
  getCacheLastUpdate() { return this.cacheLastUpdate }

  /**
   * Load the IUT's planning. Will grab from cache and refresh it every 4 hours.
   */
  async loadPlanning(): Promise<PlanningClasses> {
    if (!this.isCached()) {
      const uri = `${PLANNING_LINK}/classes`
      const data = await fetch(uri)
        .then(res => res.json())
        .catch(() => {
          throw new Error(msgId.UNREACHABLE_HOST(uri))
        })
      this.cache = data
      this.cacheLastUpdate = new Date()
    }
    return this.cache
  }

  /**
   * Find a planning group's planning. Case insensitive.
   * @param group The group planning to find
   * @throws {Error} Unknown planning group
   */
  async getGroup(group: string) {
    const planning = await this.loadPlanning()
    // Check planning group exists
    const searchedClass = Object.values(planning.classes).find(x => x.class.toLowerCase() === group.toLowerCase())
    if (!searchedClass) throw new Error(msgId.UNKNOWN_GROUP_PLANNING(group))
    return Object.values(searchedClass.weeks)
  }
}

export default new PlanningIutLoader()
