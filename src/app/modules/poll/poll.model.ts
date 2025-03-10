import { Schema, model } from 'mongoose'
import { IPoll, pollModel } from './poll.interface'

const pollSchema = new Schema<IPoll, Record<string, unknown>>(
  {
    question: {
      type: String,
      required: true,
    },
    questionType: {
      type: Number,
      required: true,
    },
    timeOut: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
      unique:true
    },
    options: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

export const Poll = model<IPoll, pollModel>('Poll', pollSchema)
