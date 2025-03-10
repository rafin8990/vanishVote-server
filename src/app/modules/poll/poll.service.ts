import { IPoll } from './poll.interface'
import { v4 as uuidv4 } from 'uuid'
import { Poll } from './poll.model'

const createPoll = async (poll: IPoll): Promise<IPoll> => {
  poll.uuid = uuidv4()
  poll.votes = poll.options.reduce((acc, option) => {
    acc[option] = 0
    return acc
  }, {} as Record<string, number>)
  const result = await Poll.create(poll)
  return result
}

export const PollService = {
  createPoll,
}
