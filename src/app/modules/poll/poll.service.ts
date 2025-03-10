import httpStatus from 'http-status'
import { v4 as uuidv4 } from 'uuid'
import ApiError from '../../../errors/ApiError'
import { IPoll } from './poll.interface'
import { Poll } from './poll.model'
import { isValidObjectId } from 'mongoose'

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
export const PollService = {
  createPoll,
  getPollById,
}
