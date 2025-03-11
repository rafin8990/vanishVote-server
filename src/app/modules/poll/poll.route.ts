import express from 'express';
import { PollController } from './poll.controller';
const router = express.Router()

router.post('/', PollController.createPoll);
router.get('/:userId/:pollId', PollController.getPollById);
router.post('/:pollId/:userId/vote', PollController.voteForOption);
router.post('/:pollId/comment', PollController.addCommentToPoll);
router.post('/:pollId/:userId/reaction', PollController.addReaction);
router.get('/:pollId/reaction-counts', PollController.getReactionCounts);
export const pollRoute = router
