import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import { PollService } from './poll.service'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'

const createPoll = catchAsync(async (req: Request, res: Response) => {
  const poll = req.body
  const result = await PollService.createPoll(poll)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'poll created successfully',
    success: true,
    data: result,
  })
})

export const PollController = {
  createPoll,
}
