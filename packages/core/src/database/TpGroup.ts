import mongoose, { Schema } from 'mongoose'
import { TpGroup, Homework } from '@aeic-bot2/common'

export type TpGroupDocument = TpGroup & mongoose.Document & { homework: mongoose.Types.Array<Homework> }

export const TpGroupModel = mongoose.model<TpGroupDocument>('TpGroup', new Schema({
  name: { type: String, required: true },
  yearGroup: { type: String, required: true },
  tdGroup: { type: String, required: true },
  planningGroup: String,
  remindChannel: String,
  homework: [{
    subject: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: String, required: true },
    dueDate: {
      type: Date,
      required: true
    },
    addedDate: {
      type: Date,
      default: () => new Date()
    }
  }]
}))
