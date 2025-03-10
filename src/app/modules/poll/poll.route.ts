import express from 'express'
import { PollController } from './poll.controller'
const router = express.Router()

router.post('/', PollController.createPoll)
router.get('/:userId/:pollId', PollController.getPollById)
export const pollRoute = router
