import mongoose, { Schema } from 'mongoose'

export interface TpGroup {
  name: string
  yearGroup: string
  tdGroup: string
  homework?: [{
    subject: string
    content: string
    authorId: string
    dueDate: Date
    addedTimestamp: Date
  }]
}

export const TpGroupModel = mongoose.model('TpGroup', new Schema({
  name: { type: String, required: true },
  yearGroup: { type: String, required: true },
  tdGroup: { type: String, required: true },
  homework: [{
    subject: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: String, required: true },
    dueDate: {
      type: Date,
      default: () => new Date()
    },
    addedDate: {
      type: Date,
      default: () => new Date()
    }
  }]
}))
