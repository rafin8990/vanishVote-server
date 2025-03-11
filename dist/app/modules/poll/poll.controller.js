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
exports.PollController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const poll_service_1 = require("./poll.service");
const createPoll = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const poll = req.body;
    const result = yield poll_service_1.PollService.createPoll(poll);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'poll created successfully',
        success: true,
        data: result,
    });
}));
const getPollById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, pollId } = req.params;
    const result = yield poll_service_1.PollService.getPollById(userId, pollId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'poll get successfully',
        success: true,
        data: result,
    });
}));
const voteForOption = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pollId, userId } = req.params;
    const { option } = req.body;
    const result = yield poll_service_1.PollService.voteForOption(pollId, userId, option);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Vote cast successfully',
        success: true,
        data: result,
    });
}));
const addCommentToPoll = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pollId } = req.params;
    const { text: commentText } = req.body; // Use "text" to match frontend
    const result = yield poll_service_1.PollService.addCommentToPoll(pollId, commentText);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Comment added successfully',
        success: true,
        data: result,
    });
}));
const addReaction = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pollId, userId } = req.params;
    const { reaction } = req.body;
    const result = yield poll_service_1.PollService.addReactionToPoll(pollId, userId, reaction);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Reaction added successfully',
        success: true,
        data: result,
    });
}));
const getReactionCounts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pollId } = req.params;
    const result = yield poll_service_1.PollService.getReactionCounts(pollId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Reaction counts fetched successfully',
        success: true,
        data: result,
    });
}));
exports.PollController = {
    createPoll,
    getPollById,
    voteForOption,
    addCommentToPoll,
    addReaction,
    getReactionCounts
};
