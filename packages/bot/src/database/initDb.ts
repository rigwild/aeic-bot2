import { TpGroupModel, TpGroup } from './TpGroup'

export const defaultTpGroups: TpGroup[] = [
  ['tp1a', 'dut1', 'td1', 'DUT1 TPA', 'tp1a-remind'],
  ['tp1b', 'dut1', 'td1', 'DUT1 TPB', 'tp1b-remind'],
  ['tp1c', 'dut1', 'td2', 'DUT1 TPC', 'tp1c-remind'],
  ['tp1d', 'dut1', 'td2', 'DUT1 TPD', 'tp1d-remind'],
  ['tp1e', 'dut1', 'td3', 'DUT1 TPE', 'tp1e-remind'],
  ['tp2a', 'dut2', 'td1', 'DUT2 TPA', 'tp2a-remind'],
  ['tp2b', 'dut2', 'td1', 'DUT2 TPB', 'tp2b-remind'],
  ['tp2c', 'dut2', 'td2', 'DUT2 TPC', 'tp2c-remind'],
  ['tp2d', 'dut2', 'td2', 'DUT2 TPD', 'tp2d-remind']
].map(x => ({
  name: x[0].toLowerCase(),
  yearGroup: x[1].toLowerCase(),
  tdGroup: x[2].toLowerCase(),
  planningGroup: x[3],
  remindChannel: x[4],
  homework: []
}))

export const defaultTpGroupsName = defaultTpGroups.map(x => x.name)

export const defaultAssoGroupsName = ['omega', 'sigma', 'theta', 'delta'].map(x => x.toLowerCase())
export const defaultYearGroupsName = ['1ere annee', '2eme annee FI', '2eme annee APP'].map(x => x.toLowerCase())

const initTpGroups = async () => {
  const count = await TpGroupModel.countDocuments({})
  if (count > 0) return

  await TpGroupModel.insertMany(defaultTpGroups)
  console.info('TP groups were created in database.')
}

export default async () => {
  try {
    await initTpGroups()
  }
  catch (error) {
    console.error(error)
  }
}
