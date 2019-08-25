import { botStart } from '@aeic-bot2/core'

import startServer from './server'

const setup = async () => {
  await botStart()
  await startServer()
}

setup()
