"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const uuid_1 = require("uuid");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const poll_model_1 = require("./poll.model");
const createPoll = (poll) => __awaiter(void 0, void 0, void 0, function* () {
    poll.uuid = (0, uuid_1.v4)();
    if (poll.questionType === 1) {
        poll.options = ['Yes', 'No'];
    }
    if (poll.questionType === 0 && poll.options && poll.options.length < 2) {
        throw new Error('At least two options are required for a multiple option poll.');
    }
    poll.votes = poll.options.reduce((acc, option) => {
        acc[option] = 0;
        return acc;
    }, {});
    const result = yield poll_model_1.Poll.create(poll);
    return result;
});
const getPollById = (userId, pollId) => __awaiter(void 0, void 0, void 0, function* () {
    const poll = yield poll_model_1.Poll.findOne({ uuid: userId, _id: pollId });
    if (!poll) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Poll not found');
    }
    return poll;
});
const voteForOption = (pollId, userId, option) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const poll = yield poll_model_1.Poll.findById(pollId);
    if (!poll) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Poll not found');
    }
    if (!poll.options.includes(option)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid option selected');
    }
    if (!poll.votes) {
        poll.votes = {};
    }
    if (!poll.voters) {
        poll.voters = new Map();
    }
    if (poll.voters.get(userId)) {
        const previousVote = poll.voters.get(userId);
        if (previousVote === option) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You have already voted for this option');
        }
        if (previousVote && poll.votes[previousVote] > 0) {
            poll.votes[previousVote] -= 1;
        }
    }
    poll.votes[option] = ((_a = poll.votes[option]) !== null && _a !== void 0 ? _a : 0) + 1;
    poll.voters.set(userId, option);
    poll.markModified('votes');
    poll.markModified('voters');
    yield poll.save();
    return poll;
});
const addCommentToPoll = (pollId, commentText) => __awaiter(void 0, void 0, void 0, function* () {
    if (!commentText || commentText.trim() === '') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Comment text cannot be empty'); // Check for empty string
    }
    const poll = yield poll_model_1.Poll.findById(pollId);
    if (!poll) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Poll not found');
    }
    poll.comments.push({
        text: commentText,
        createdAt: new Date(),
    });
    try {
        yield poll.save();
        return poll;
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Validation Error: ' + error.message);
        }
        else {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to add comment: ' + error.message);
        }
    }
});
const addReactionToPoll = (pollId, userId, reaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    const poll = yield poll_model_1.Poll.findById(pollId);
    if (!poll) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Poll not found');
    }
    const validReactions = ['Trending', 'Like'];
    if (!validReactions.includes(reaction)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid reaction');
    }
    if (!poll.reactions || typeof poll.reactions !== 'object') {
        poll.reactions = {};
    }
    if (!poll.reactionCounts) {
        poll.reactionCounts = { Trending: 0, Like: 0 };
    }
    const previousReaction = poll.reactions[userId];
    if (previousReaction) {
        if (previousReaction === reaction) {
            delete poll.reactions[userId];
            poll.reactionCounts[reaction] = Math.max(((_b = poll.reactionCounts[reaction]) !== null && _b !== void 0 ? _b : 1) - 1, 0);
        }
        else {
            poll.reactionCounts[previousReaction] = Math.max(((_c = poll.reactionCounts[previousReaction]) !== null && _c !== void 0 ? _c : 1) - 1, 0);
            poll.reactions[userId] = reaction;
            poll.reactionCounts[reaction] = ((_d = poll.reactionCounts[reaction]) !== null && _d !== void 0 ? _d : 0) + 1;
        }
    }
    else {
        poll.reactions[userId] = reaction;
        poll.reactionCounts[reaction] = ((_e = poll.reactionCounts[reaction]) !== null && _e !== void 0 ? _e : 0) + 1;
    }
    poll.markModified('reactions');
    poll.markModified('reactionCounts');
    yield poll.save();
    return poll;
});
const getReactionCounts = (pollId) => __awaiter(void 0, void 0, void 0, function* () {
    const poll = yield poll_model_1.Poll.findById(pollId);
    if (!poll) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Poll not found');
    }
    return poll.reactionCounts;
});
exports.PollService = {
    createPoll,
    getPollById,
    voteForOption,
    addCommentToPoll,
    addReactionToPoll,
    getReactionCounts,
};
