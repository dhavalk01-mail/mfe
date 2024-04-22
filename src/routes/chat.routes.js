const express = require("express");
const chat = require("./../controllers/chat.controller");
const role = require("./../middleware/role");
const router = express.Router();


// create chat session by user
router.post("/chat", role.isUser, chat.postChatSessionDetail);


// route for chat session detail which are in pool
router.get("/chat/pool", role.isAgent, chat.getPoolChatSessionDetail);

// agent's active chat list
router.get("/chat/agent",  role.isAgent, chat.getAgentActiveChat);

// chat with all messages session details
router.get("/chat/:chatId", chat.getChatSessionDetail);


// pool chat accepted by agent
router.put("/chat/:chatId/accept", role.isAgent, chat.putAcceptChatbyAgent);


// end chat session by agent
router.put("/chat/:chatId/end", role.isAgent, chat.putEndChatbyAgent);

// post message
router.post("/chat/:chatId/message", chat.postMessage);

module.exports = router;