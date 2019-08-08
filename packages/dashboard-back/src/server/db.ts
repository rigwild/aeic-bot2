import Loki from 'lokijs'

import { dbPath } from '../config'

export let dbInstance: Loki
export let dataCollection: Collection<any>

export const loadDb = () => new Promise((resolve) => {
  dbInstance = new Loki(dbPath, {
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

export const addDbData = (token: object, discordUser: object) => dataCollection.insert({ token, discordUser })
