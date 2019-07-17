import { Command } from '../types'
import msgId from '../msgId'
import { TpGroupModel, TpGroup } from '../database/TpGroup'

const command: Command = {
  meta: {
    command: 'test',
    minArgs: 0
  },

  async run(message, un, deux, trois) {
    await message.reply(un)
    await message.reply(deux)
    await message.reply(trois)
    // TpGroupModel.create(<TpGroup>{
    //   name: 'tp2b',
    //   yearGroup: 'dut2',
    //   tdGroup: 'td1'
    // })
    // message.reply(msgId.AEIC_BOT_HELP)
  }
}
export default command
