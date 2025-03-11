import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { PollService } from './poll.service'

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
const getPollById = catchAsync(async (req: Request, res: Response) => {
  const { userId, pollId } = req.params
  const result = await PollService.getPollById(userId, pollId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'poll get successfully',
    success: true,
    data: result,
  })
})

const voteForOption = catchAsync(async (req: Request, res: Response) => {
  const { pollId, userId } = req.params; 
  const { option } = req.body;
  const result = await PollService.voteForOption(pollId, userId, option);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Vote cast successfully',
    success: true,
    data: result,
  });
});

const addCommentToPoll = catchAsync(async (req: Request, res: Response) => {
  const { pollId } = req.params; 
  const { commentText } = req.body; 
  const result = await PollService.addCommentToPoll(pollId, commentText);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Comment added successfully',
    success: true,
    data: result,
  });
});
const addReaction = catchAsync(async (req: Request, res: Response) => {
  const { pollId, userId } = req.params;  
  const {reaction} = req.body;  
  
  const result = await PollService.addReactionToPoll(pollId, userId, reaction);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Reaction added successfully',
    success: true,
    data: result,
  });
});
const getReactionCounts = catchAsync(async (req: Request, res: Response) => {
  const { pollId } = req.params; 
  const result = await PollService.getReactionCounts(pollId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Reaction counts fetched successfully',
    success: true,
    data: result,
  });
});

export const PollController = {
  createPoll,
  getPollById,
  voteForOption,
  addCommentToPoll,
  addReaction,
  getReactionCounts
}
