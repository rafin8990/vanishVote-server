import { Model } from 'mongoose';

export type IPoll = {
  question: string;
  questionType: number;
  timeOut: string;
  uuid: string;
  options: string[];
  votes: Record<string, number>;
  comments: { text: string; createdAt: Date }[];
  voters: Map<string, string>;
  reactions: { [key: string]: string };  
  reactionCounts: { [key: string]: number };
}

export type pollModel = Model<IPoll, Record<string, unknown>>
