import { TpGroupModel, TpGroup } from './TpGroup'
import { logger } from '../config'

export const defaultTpGroups: TpGroup[] = [
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

export const defaultTpGroupsName = defaultTpGroups.map(x => x.name)

export const defaultAssoGroupsName = ['omega', 'sigma', 'theta', 'delta']

const initTpGroups = async () => {
  const count = await TpGroupModel.countDocuments({})
  if (count > 0) return

  await TpGroupModel.insertMany(defaultTpGroups)
  logger.info('TP groups were created in database.')
}

export default async () => {
  try {
    await initTpGroups()
  }
  catch (error) {
    logger.error(error)
  }
}
