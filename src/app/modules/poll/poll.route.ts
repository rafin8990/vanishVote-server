import express from 'express'
import { PollController } from './poll.controller'
const router = express.Router()

router.post('/', PollController.createPoll)
export const pollRoute = router
