import mongoose, { Schema } from 'mongoose'

export interface Homework {
  subject: string
  content: string
  authorId: string
  dueDate: Date
  addedTimestamp?: Date
}

export interface TpGroup {
  name: string
  yearGroup: string
  tdGroup: string
  homework?: Homework[]
}

export type TpGroupDocument = TpGroup & mongoose.Document

export const TpGroupModel = mongoose.model<TpGroupDocument>('TpGroup', new Schema({
  name: { type: String, required: true },
  yearGroup: { type: String, required: true },
  tdGroup: { type: String, required: true },
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
