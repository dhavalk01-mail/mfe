const mongoose = require('mongoose');
const User = require('./user.model');
const ChatSession = require('./chatSession.model');


//Define a schema
const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
    sessionId: {
        type: Schema.Types.ObjectId,
        ref: 'ChatSession',
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }
},
    { timestamps: true },
    { versionKey: false }
);

module.exports = mongoose.model("Message", messageSchema);