"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poll = void 0;
const mongoose_1 = require("mongoose");
const pollSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: true,
    },
    questionType: {
        type: Number,
        required: true,
    },
    timeOut: {
        type: String,
        required: true,
    },
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    votes: {
        type: Object,
        default: {},
    },
    options: {
        type: [String],
        required: true,
    },
    comments: [
        {
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    voters: {
        type: Object,
        default: {},
    },
    reactions: {
        type: Object,
        default: {},
    },
    reactionCounts: {
        type: Object,
        default: {
            Trending: 0,
            Like: 0,
        },
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Poll = (0, mongoose_1.model)('Poll', pollSchema);
