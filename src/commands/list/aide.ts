import { Command } from '../types'
import msgId from '../../msgId'
import { COMMAND_TRIGGER as t } from '../../config'

const command: Command = {
  meta: {
    command: 'aide',
    minArgs: 0,
    maxArgs: 0,
    description: 'Montrer le message d\'aide du bot',
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
