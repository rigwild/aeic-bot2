export declare interface Homework {
  subject: string
  content: string
  authorId: string
  dueDate: Date
  addedDate?: Date
}

export declare interface TpGroup {
  name: string
  yearGroup: string
  tdGroup: string
  planningGroup?: string
  remindChannel?: string
  homework: Homework[]
}