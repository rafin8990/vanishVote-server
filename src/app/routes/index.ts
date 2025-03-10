import express from 'express'
import { pollRoute } from '../modules/poll/poll.route'
const router = express.Router()

const moduleRoutes = [
  {
    path: '/poll',
    route: pollRoute,
  },
]
moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
