import { Command } from '../types'
import msgId from '../msgId'

const command: Command = {
  meta: {
    command: 'aide',
    minArgs: 0,
    maxArgs: 0,
    shortDescription: 'Afficher l\'aide',
    description: 'Montrer le message d\'aide du bot',
    example: '!aide'
  },

  async run(message) {
    message.reply(msgId.AEIC_BOT_HELP)
  }
}
export default command
