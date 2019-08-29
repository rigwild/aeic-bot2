import { removeAccents } from './utils'
import { TpGroup } from './types'

export const defaultTpGroups: TpGroup[] = [
  ['tp1a', 'dut1', 'td1', 'DUT1 TPA', 'tp1a-remind'],
  ['tp1b', 'dut1', 'td1', 'DUT1 TPB', 'tp1b-remind'],
  ['tp1c', 'dut1', 'td2', 'DUT1 TPC', 'tp1c-remind'],
  ['tp1d', 'dut1', 'td2', 'DUT1 TPD', 'tp1d-remind'],
  ['tp1e', 'dut1', 'td3', 'DUT1 TPE', 'tp1e-remind'],
  ['tp2a', 'dut2', 'td1', 'DUT2 TPA', 'tp2a-remind'],
  ['tp2b', 'dut2', 'td1', 'DUT2 TPB', 'tp2b-remind'],
  ['tp2c', 'dut2', 'td2', 'DUT2 TPC', 'tp2c-remind'],
  ['tp2d', 'dut2', 'td2', 'DUT2 TPD', 'tp2d-remind'],
  ['licencepro', 'dut3', 'td1', 'DUT3 LP', 'lp-remind']
].map(x => ({
  name: x[0],
  yearGroup: x[1],
  tdGroup: x[2],
  planningGroup: x[3],
  remindChannel: x[4],
  homework: []
}))

export const defaultTpGroupsName = defaultTpGroups.map(x => x.name)

export const defaultAssoGroupsNameReal = ['Omega', 'Sigma', 'Theta', 'Delta']
export const defaultAssoGroupsName = defaultAssoGroupsNameReal.map(x => removeAccents(x.toLowerCase()))

export const defaultYearGroupsNameReal = ['1ère année', '2ème année FI', '2ème année APP', 'Licence Pro', 'Ancêtre']
export const defaultYearGroupsName = defaultYearGroupsNameReal.map(x => removeAccents(x.toLowerCase()))
