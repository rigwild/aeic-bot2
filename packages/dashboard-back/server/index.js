import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'

import routes from './routes'
import { loadDb } from './db'
import { SERVER_PORT } from '../config'
import { errorHandler } from './utils'
const morgan = require('morgan')

const app = express()

// Use gzip compression to improve performance
app.use(compression())

// Enhance the app security by setting some HTTP headers
app.use(helmet())

// Turn "Cross-origin resource sharing" on to allow remote clients to connect to the API
app.use(cors())

app.use(morgan('dev'))

// Parse JSON input
app.use(express.json())

// Serve the API
app.use('/api', routes)

// Error handler
app.use(errorHandler)

export default async () => {
  console.log('Loading the database...')
  await loadDb()
  console.log('The database was loaded.')
  console.log('Starting the server...')
  app.listen(SERVER_PORT, () => console.log(`The server is listening on http://localhost:${SERVER_PORT}.`))
  return app
}
