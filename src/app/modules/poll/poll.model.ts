import { Schema, model } from 'mongoose';
import { IPoll, pollModel } from './poll.interface';

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
      unique: true,
    },
    votes: {
      type: Object,
      default: {},
    },
    options: {
      type: [String],
      required: true,
    },
    comments: [
      {
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    voters: {
      type: Object,  
      default: {},
    },
    reactions: {
      type: Object,
      default: {},
    },
    reactionCounts: {
      type: Object,  
      default: {
        Trending: 0,
        Like: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Poll = model<IPoll, pollModel>('Poll', pollSchema);
