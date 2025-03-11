"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
const config = {
    port: 5000,
    database_url: process.env.DATABASE_URL || '',
    bycrypt_sault_round: 12,
    env: process.env.NODE_ENV,
    jwt_secret: 'secret',
    jwt_expires_in: '1d',
    jwt_refresh_secret: 'very very secret',
    jwt_refresh_expires_in: '365d',
};
exports.default = config;
