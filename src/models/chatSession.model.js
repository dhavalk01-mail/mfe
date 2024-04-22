const mongoose = require('mongoose');
const User = require('./user.model');
// const user = require('../controllers/user.controller');


//Define a schema
const Schema = mongoose.Schema;

const chatSessionSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    agentId: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: false,
        default: null
    },
    startTime: {
        type: Date,
        default: Date.now,
    },
    endTime: Date,
    status: {
        type: String,
        enum: ["POOL", "ACTIVE", "CLOSED"],
        default: "POOL"
    }
},
    { timestamps: true },
    { versionKey: false }
);

module.exports = mongoose.model("ChatSession", chatSessionSchema);