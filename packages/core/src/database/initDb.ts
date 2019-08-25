import { defaultTpGroups } from '@aeic-bot2/common'

import { TpGroupModel } from './TpGroup'

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
