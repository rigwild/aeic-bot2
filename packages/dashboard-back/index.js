import startServer from './server'
import { start as botStart } from './server/bot'

const setup = async () => {
  await botStart()
  await startServer()
}

setup()
