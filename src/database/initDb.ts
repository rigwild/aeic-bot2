import { TpGroupModel, TpGroup } from './TpGroup'
import { logger } from '../config'

const initTpGroups = async () => {
  const count = await TpGroupModel.countDocuments({})
  if (count > 0) return

  const groups: TpGroup[] = [
    ['tp1a', 'dut1', 'td1'],
    ['tp1b', 'dut1', 'td1'],
    ['tp1c', 'dut1', 'td2'],
    ['tp1d', 'dut1', 'td2'],
    ['tp1e', 'dut1', 'td3'],
    ['tp2a', 'dut2', 'td1'],
    ['tp2b', 'dut2', 'td1'],
    ['tp2c', 'dut2', 'td2'],
    ['tp2d', 'dut2', 'td2'],
  ].map(x => ({
    name: x[0].toLowerCase(),
    yearGroup: x[1].toLowerCase(),
    tdGroup: x[2].toLowerCase()
  }))
  await TpGroupModel.insertMany(groups)
  logger.info('TP groups were created in database.')
}

export default async () => {
  try {
    await initTpGroups()
  }
  catch (error) {
    logger.error(error.message)
  }
}
