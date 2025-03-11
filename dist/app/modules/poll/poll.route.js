"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollRoute = void 0;
const express_1 = __importDefault(require("express"));
const poll_controller_1 = require("./poll.controller");
const router = express_1.default.Router();
router.post('/', poll_controller_1.PollController.createPoll);
router.get('/:userId/:pollId', poll_controller_1.PollController.getPollById);
router.post('/:pollId/:userId/vote', poll_controller_1.PollController.voteForOption);
router.patch('/:pollId/comment', poll_controller_1.PollController.addCommentToPoll);
router.post('/:pollId/:userId/reaction', poll_controller_1.PollController.addReaction);
router.get('/:pollId/reaction-counts', poll_controller_1.PollController.getReactionCounts);
exports.pollRoute = router;
