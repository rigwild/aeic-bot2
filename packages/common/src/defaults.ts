import { removeAccents } from './utils'
import { TpGroup } from './types'

export const defaultTpGroups: TpGroup[] = [
  ['1tpa', 'dut1', 'td1', 'DUT1 TPA', '1tpa-remind'],
  ['1tpb', 'dut1', 'td1', 'DUT1 TPB', '1tpb-remind'],
  ['1tpc', 'dut1', 'td2', 'DUT1 TPC', '1tpc-remind'],
  ['1tpd', 'dut1', 'td2', 'DUT1 TPD', '1tpd-remind'],
  ['1tpe', 'dut1', 'td3', 'DUT1 TPE', '1tpe-remind'],
  ['2tpa', 'dut2', 'td1', 'DUT2 TPA', '2tpa-remind'],
  ['2tpb', 'dut2', 'td1', 'DUT2 TPB', '2tpb-remind'],
  ['2tpc', 'dut2', 'td2', 'DUT2 TPC', '2tpc-remind'],
  ['2tpd', 'dut2', 'td2', 'DUT2 TPD', '2tpd-remind'],
  ['2app', 'dut2', 'td3', 'DUT INFO2 Apprentissage', '2app-remind'],
  ['licencepro', 'dut3', 'td1', 'LP DIM Apprentissage', 'licencepro-remind']
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
