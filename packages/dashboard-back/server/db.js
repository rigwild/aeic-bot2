import Loki from 'lokijs'

/**
 * @type {Loki}
 */
export let dbInstance

/**
 * @type {Collection<any>}
 */
export let dataCollection

export const loadDb = () => new Promise((resolve) => {
  dbInstance = new Loki('aeic-bot2-dashboard.db', {
    autoload: true,
    autosave: true,
    autosaveInterval: 4000,
    autoloadCallback: () => {
      dataCollection = dbInstance.getCollection('data')
      // If the data collection does not exist yet, create it
      if (dataCollection === null)
        dataCollection = dbInstance.addCollection('data')
      resolve()
    }
  })
})

export const addDbData = (token, discordUser) => dataCollection.insert({ token, discordUser })
