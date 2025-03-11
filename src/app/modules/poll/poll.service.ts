import httpStatus from 'http-status'
import { v4 as uuidv4 } from 'uuid'
import ApiError from '../../../errors/ApiError'
import { IPoll } from './poll.interface'
import { Poll } from './poll.model'

const createPoll = async (poll: IPoll): Promise<IPoll> => {
  poll.uuid = uuidv4()

  if (poll.questionType === 1) {
    poll.options = ['Yes', 'No']
  }

  if (poll.questionType === 0 && poll.options && poll.options.length < 2) {
    throw new Error(
      'At least two options are required for a multiple option poll.'
    )
  }
  poll.votes = poll.options.reduce((acc, option) => {
    acc[option] = 0
    return acc
  }, {} as Record<string, number>)
  const result = await Poll.create(poll)
  return result
}

const getPollById = async (userId: string, pollId: string): Promise<IPoll> => {
  const poll = await Poll.findOne({ uuid: userId, _id: pollId })
  if (!poll) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Poll not found')
  }

  return poll
}

const voteForOption = async (pollId: string, userId: string, option: string): Promise<IPoll> => {
  const poll = await Poll.findById(pollId);
  if (!poll) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Poll not found');
  }

  if (!poll.options.includes(option)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid option selected');
  }

  if (poll.voters.has(userId)) {
    const previousVote = poll.voters.get(userId);

    if (previousVote === option) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You have already voted for this option');
    } else if (previousVote) {
      const previousVoteCount = poll.votes[previousVote] ?? 0;  
      poll.votes[previousVote] = previousVoteCount - 1;
    }
  }

  const currentVoteCount = poll.votes[option] ?? 0;  
  poll.votes[option] = currentVoteCount + 1;
  poll.voters.set(userId, option);

  await poll.save();
  return poll;
};

const addCommentToPoll = async (pollId: string, commentText: string): Promise<IPoll> => {
  const poll = await Poll.findById(pollId);
  if (!poll) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Poll not found');
  }

  poll.comments.push({
    text: commentText,
    createdAt: new Date(),
  });

  await poll.save();
  return poll;
};

const addReactionToPoll = async (pollId: string, userId: string, reaction: string): Promise<IPoll> => {
  const poll = await Poll.findById(pollId);
  if (!poll) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Poll not found');
  }

  const validReactions = ['Trending', 'Like'];
  if (!validReactions.includes(reaction)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid reaction');
  }

  if (poll.reactions.has(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You have already reacted to this poll');
  }

  const reactionCounts = new Map<string, number>(Object.entries(poll.reactionCounts));
  const currentReactionCount = reactionCounts.get(reaction) ?? 0;
  reactionCounts.set(reaction, currentReactionCount + 1);
  poll.reactionCounts = Object.fromEntries(reactionCounts);
  await poll.save();

  return poll;
};

const getReactionCounts = async (pollId: string): Promise<Record<string, number>> => {
  const poll = await Poll.findById(pollId);
  if (!poll) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Poll not found');
  }

  return poll.reactionCounts;
};

 

export const PollService = {
  createPoll,
  getPollById,
  voteForOption,
  addCommentToPoll,
  addReactionToPoll,
  getReactionCounts
}
