import mongoose from 'mongoose'

import { MONGO_URI } from '../config'
import initDb from './initDb'

export { TpGroupModel } from './TpGroup'

export const connectDb = async () => {
  // Connect to the database
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  mongoose.connection.on('error', err => {
    throw err
  })
  console.info('The database connection was established.')

  // Initialize database collections
  await initDb()
}
