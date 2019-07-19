import { Command } from '../types'
import { COMMAND_TRIGGER as t, ARG_SEPARATOR as s } from '../../config'

const command: Command = {
  meta: {
    command: 'myCommand',
    minArgs: 1,
    maxArgs: 3,
    description: 'A command description',
    examples: [
      // !myCommand arg1 -- arg2 -- arg3-example-1
      `${t}myCommand arg1 ${s} arg2 ${s} arg3-example-1`,
      `${t}myCommand arg1 ${s} arg2 ${s} arg3-example-2`
    ]
  },

  async run(message, ...args) {
    await message.reply(`This is a template command and should not be used. Passed arguments: ${args}`)
  }
}
export default command
