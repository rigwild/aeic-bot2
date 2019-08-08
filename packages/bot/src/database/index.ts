import mongoose from 'mongoose'

import { MONGO_URI, logger } from '../config'
import initDb from './initDb'

const connectDb = async () => {
  // Connect to the database
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  mongoose.connection.on('error', err => logger.error(err.message))
  logger.info('The database connection was established.')

  // Initialize database collections
  await initDb()
}

export default connectDb
