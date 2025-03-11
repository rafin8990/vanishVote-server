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

const voteForOption = async (
  pollId: string,
  userId: string,
  option: string
): Promise<IPoll> => {
  const poll = await Poll.findById(pollId)
  if (!poll) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Poll not found')
  }

  if (!poll.options.includes(option)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid option selected')
  }

  if (!poll.votes) {
    poll.votes = {}
  }
  if (!poll.voters) {
    poll.voters = new Map<string, string>()
  }

  if (poll.voters.get(userId)) {
    const previousVote = poll.voters.get(userId)

    if (previousVote === option) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'You have already voted for this option'
      )
    }

    if (previousVote && poll.votes[previousVote] > 0) {
      poll.votes[previousVote] -= 1
    }
  }

  poll.votes[option] = (poll.votes[option] ?? 0) + 1
  poll.voters.set(userId, option)

  poll.markModified('votes')
  poll.markModified('voters')

  await poll.save()
  return poll
}

const addCommentToPoll = async (
  pollId: string,
  commentText: string
): Promise<IPoll> => {
  if (!commentText || commentText.trim() === '') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Comment text cannot be empty') // Check for empty string
  }

  const poll = await Poll.findById(pollId)
  if (!poll) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Poll not found')
  }

  poll.comments.push({
    text: commentText,
    createdAt: new Date(),
  })

  try {
    await poll.save()
    return poll
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Validation Error: ' + error.message
      )
    } else {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to add comment: ' + error.message
      )
    }
  }
}

const addReactionToPoll = async (
  pollId: string,
  userId: string,
  reaction: string
): Promise<IPoll> => {
  const poll = await Poll.findById(pollId)
  if (!poll) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Poll not found')
  }

  const validReactions = ['Trending', 'Like']
  if (!validReactions.includes(reaction)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid reaction')
  }

  if (!poll.reactions || typeof poll.reactions !== 'object') {
    poll.reactions = {}
  }
  if (!poll.reactionCounts) {
    poll.reactionCounts = { Trending: 0, Like: 0 }
  }

  const previousReaction = poll.reactions[userId]

  if (previousReaction) {
    if (previousReaction === reaction) {
      delete poll.reactions[userId]
      poll.reactionCounts[reaction] = Math.max(
        (poll.reactionCounts[reaction] ?? 1) - 1,
        0
      )
    } else {
      poll.reactionCounts[previousReaction] = Math.max(
        (poll.reactionCounts[previousReaction] ?? 1) - 1,
        0
      )
      poll.reactions[userId] = reaction
      poll.reactionCounts[reaction] = (poll.reactionCounts[reaction] ?? 0) + 1
    }
  } else {
    poll.reactions[userId] = reaction
    poll.reactionCounts[reaction] = (poll.reactionCounts[reaction] ?? 0) + 1
  }

  poll.markModified('reactions')
  poll.markModified('reactionCounts')

  await poll.save()
  return poll
}

const getReactionCounts = async (
  pollId: string
): Promise<Record<string, number>> => {
  const poll = await Poll.findById(pollId)
  if (!poll) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Poll not found')
  }

  return poll.reactionCounts
}

export const PollService = {
  createPoll,
  getPollById,
  voteForOption,
  addCommentToPoll,
  addReactionToPoll,
  getReactionCounts,
}
