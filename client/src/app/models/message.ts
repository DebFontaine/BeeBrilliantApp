export interface Message {
    id: number
    recipientId: number
    content: object | string
    dateRead?: Date
    messageSent: Date
  }