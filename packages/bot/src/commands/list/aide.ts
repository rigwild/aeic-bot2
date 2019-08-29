import { config, msgId } from '@aeic-bot2/core'
const { COMMAND_TRIGGER: t } = config

import { Command } from '../types'

const command: Command = {
  meta: {
    command: 'aide',
    minArgs: 0,
    maxArgs: 0,
    description: 'Montrer le message d\'aide du bot.',
    examples: [
      // !aide
      `${t}aide`
    ]
  },

  async run(message) {
    await message.reply(msgId.AEIC_BOT_HELP)
  }
}
export default command
