"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.User = void 0;
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../database/database");
const Constant = __importStar(require("../constants/constant"));
class User {
    constructor(username, password) {
        this.permissions = [];
        this.username = username;
        this.password = crypto_1.default.createHash('sha256').update(password).digest('hex');
        const { publicKey, privateKey } = crypto_1.default.generateKeyPairSync('rsa', { modulusLength: 2048 });
        this.publicKey = publicKey.export({ format: 'pem', type: 'spki' }).toString();
        this.privateKey = privateKey.export({ format: 'pem', type: 'pkcs8' }).toString();
        this.permissions = ['read', 'write'];
    }
    saveToDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.createRecord)(Constant.USER_TABLE_NAME, this.username, JSON.stringify(this));
            }
            catch (error) {
                console.log(`Error occured at userModel.ts -> saveToDatabase: ${error.message}`);
            }
        });
    }
    static getByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield (0, database_1.readRecord)(Constant.USER_TABLE_NAME, username);
                return JSON.parse(userData);
            }
            catch (error) {
                console.log(`Error occured at userModel.ts -> getByUsername ${error.message}`);
                return null;
            }
        });
    }
}
exports.User = User;
