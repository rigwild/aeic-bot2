import mongoose from 'mongoose'

import { MONGO_URI } from '../config'

const connectDb = async () => {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  mongoose.connection.on('error', console.error)
  console.log('The database connection was established.')
}

export default connectDb
