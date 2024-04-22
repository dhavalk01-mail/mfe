const chatSession = require("./../models/chatSession.model");
const MessageModel = require("./../models/message.model");
const errorFunction = require("./../utils/errorFunction");
const ObjectId = require("mongoose").Types.ObjectId;

// input json for postChatSessionDetail
// {
//     "message": "hello"
// }
// output json for postChatSessionDetail
// {
//     "error": false,
//     "message": "success",
//     "data": {
//         "sessionId": "XXXXXXXXXXXXXXXXXXXXXXX",
//         "userId": "XXXXXXXXXXXXXXXXXXXXXXX",
//         "agentId": "XXXXXXXXXXXXXXXXXXXXXXX",
//         "status": "ACTIVE"
//     }
// }
const postChatSessionDetail = async (req, res) => {
    if (!req.body.message) {
        return res.status(400).json(errorFunction(true, "message is required"));
    }

    try {
        const chatSessionDetailBody = {
            userId: req.user.id,
            status: 'POOL'
        }
        const chatSessionDetail = await chatSession.create(chatSessionDetailBody);
        if (chatSessionDetail) {
            try {
                const messageBody = {
                    sessionId: chatSessionDetail._id,
                    senderId: req.user.id,
                    message: req.body.message
                }
                await MessageModel.create(messageBody);
                res.status(200).json(errorFunction(false, "success", chatSessionDetail));
            } catch (error) {
                await chatSession.findOneAndDelete({ _id: chatSessionDetail._id });
                await MessageModel.findOneAndDelete({ sessionId: chatSessionDetail._id });
                res.status(500).json(errorFunction(true, "error", error));
                return;
            }
        }
    } catch (error) {
        res.status(500).json(errorFunction(true, "error", error));
    }
}


// output json for getChatSessionDetail
// {
//     "success": true,
//     "message": "success",
//     "data": {
//         "sessionId": "XXXXXXXXXXXXXXXXXXXXXXX",
//         "userId": "XXXXXXXXXXXXXXXXXXXXXXX",
//         "agentId": "XXXXXXXXXXXXXXXXXXXXXXX",
//         "status": "ACTIVE",
//         "messages": [
//             {
//                 "sessionId": "XXXXXXXXXXXXXXXXXXXXXXX",
//                 "senderId": "XXXXXXXXXXXXXXXXXXXXXXX",
//                 "message": "hello",
//                 "timestamp": "2021-07-01T12:54:52.876Z"
//             }
//         ]
//     }
// }

const getChatSessionDetail = async (req, res) => {
    if (!req.params.chatId) {
        return res.status(400).json(errorFunction(true, "chat id is required"));
    }

    const { chatId } = req.params;
    try {
        // const chatSessionDetail = await MessageModel.find({"sessionId": chatId}).populate('sessionId senderId');
        const chatSessionDetail = await chatSession.aggregate([
            { $match: { _id: new ObjectId(chatId), status: 'ACTIVE' } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId',
                    pipeline: [
                        { $project: { _id: 0, username: 1, email: 1, role: 1 } }
                    ]
                },
            },
            { $unwind: '$userId' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'agentId',
                    foreignField: '_id',
                    as: 'agentId',
                    pipeline: [
                        { $project: { _id: 0, username: 1, email: 1, role: 1 } }
                    ],
                }
            },
            { $unwind: '$agentId' },
            {
                $lookup: {
                    from: 'messages',
                    localField: '_id',
                    foreignField: 'sessionId',
                    as: 'messages',
                    pipeline: [
                        { $project: { _id: 0, senderId: 1, message: 1, createdAt: 1, } },
                        {
                            $lookup: {
                                from: 'users', localField: 'senderId', foreignField: '_id', as: 'sender',
                                pipeline: [
                                    { $project: { _id: 0, username: 1, role: 1 } }
                                ]
                            }
                        },
                        { $unwind: '$sender' },
                    ]
                }
            },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            {
                $group: {
                    _id: '$_id',
                    status: { $first: '$status' },
                    startTime: { $first: '$startTime' },
                    endTime: { $first: '$endTime' },
                    createdAt: { $first: '$createdAt' },
                    messages: { $push: '$messages' },
                    userId: { $first: '$userId' },
                    agentId: { $first: '$agentId' },
                }
            }
        ]);
        if(chatSessionDetail.length > 0){
            res.status(200).json(errorFunction(false, "success", chatSessionDetail));
        } else {
            res.status(404).json(errorFunction(true, "error", "Chat is not accepted yet by agent or is not available with us. Please check after sometime."));
        }
    }
    catch (error) {
        res.status(500).json(errorFunction(true, "error", error.message));
    }
}


//output json for getPoolChatSessionDetail
// {
//     "error": false,
//     "message": "success",
//     "data": [
//         {
//             "sessionId": "XXXXXXXXXXXXXXXXXXXXXXX",
//             "userId": "XXXXXXXXXXXXXXXXXXXXXXX",
//             "agentId": "XXXXXXXXXXXXXXXXXXXXXXX",
//             "status": "POOL"
//         }
//     ]
// }
const getPoolChatSessionDetail = async (req, res) => {
    try {
        const chatSessionDetail = await chatSession.find({ status: 'POOL' }).populate({
            path: 'userId', select: 'username email role'
        });
        res.status(200).json(errorFunction(false, "success", chatSessionDetail));
    } catch (error) {
        res.status(500).json(errorFunction(true, "error", error));
    }
}


const putAcceptChatbyAgent = async (req, res) => {
    // validation
    if (!req.params.chatId) {
        return res.status(400).json(errorFunction(true, "chat id is required"));
    }

    // const chatSessionDetail = await chatSession.findOne({ _id: req.params.chatId, status: 'POOL' });
    // if (!chatSessionDetail) {
    //     return res.status(400).json(errorFunction(true, "error", "Chat session not found"));
    // }
    // if (chatSessionDetail.agentId) {
    //     return res.status(400).json(errorFunction(true, "error", "Chat session is already accepted"));
    // }
    // if (chatSessionDetail.status !== 'POOL') {
    //     return res.status(400).json(errorFunction(true, "error", "Chat session is not in pool"));
    // }


    const agentId = req.user.id;
    try {
        const chatSessionDetail = await chatSession.findOneAndUpdate(
            { _id: req.params.chatId, agentId: null, status: "POOL" },
            { agentId, status: 'ACTIVE' },
            { new: true });
        if (chatSessionDetail) {
            res.status(200).json(errorFunction(false, "success", chatSessionDetail));
        } else {
            res.status(400).json(errorFunction(true, "error", "Chat not found"));
        }
    } catch (error) {
        res.status(500).json(errorFunction(true, "error", error));
    }
}


const getAgentActiveChat = async (req, res) => {
    const agentId = req.user.id;
    try {
        var chatSessionDetail = await chatSession.find({ agentId, status: 'ACTIVE' }).populate('userId agentId');
        // delete few key from chatSessionDetail and the send
        chatSessionDetail = chatSessionDetail.map(element => {
            element = element.toObject();
            delete element.userId.password;
            delete element.agentId.password;
            delete element.userId.createdAt;
            delete element.agentId.createdAt;
            delete element.userId.updatedAt;
            delete element.agentId.updatedAt;
            delete element.userId.__v;
            delete element.agentId.__v;
            delete element.userId.is_active;
            delete element.agentId.is_active;
            delete element.__v;
            return element;
        })

        // console.log(chatSessionDetail.agentId.password);
        // chatSessionDetail = chatSessionDetail.toObject();
        // chatSessionDetail = chatSessionDetail.forEach(element => {
        //     delete element.userId.password;
        //     delete element.agentId.password;
        //     delete element.userId.createdAt;
        //     delete element.agentId.createdAt;
        //     delete element.userId.updatedAt;
        //     delete element.agentId.updatedAt;
        //     delete element.userId.__v;
        //     delete element.agentId.__v;
        // })
        // delete chatSessionDetail.agentId.password;
        // delete chatSessionDetail.userId.password;
        res.status(200).json(errorFunction(false, "success", chatSessionDetail));
    }
    catch (error) {
        res.status(500).json(errorFunction(true, "error", error.message));
    }
}



const putEndChatbyAgent = async (req, res) => {
    // validation
    if (!req.params.chatId) {
        return res.status(400).json(errorFunction(true, "chat id is required"));
    }
    const agentId = req.user.id;
    try {
        const chatSessionDetail = await chatSession.findOneAndUpdate(
            { _id: req.params.chatId, agentId, status: "ACTIVE" },
            { endTime: Date.now(), status: 'CLOSED' },
            { new: true });
        if (chatSessionDetail) {
            res.status(200).json(errorFunction(false, "success", chatSessionDetail));
        } else {
            res.status(400).json(errorFunction(true, "error", "Chat not found"));
        }
    } catch (error) {
        res.status(500).json(errorFunction(true, "error", error));
    }
}

/**
 * 
// input json for postMessage
// {
//     "message": "hello"
// }
// output
// {
//     "success": true,
//     "message": "success",
//     "data": {
//         "sessionId": "XXXXXXXXXXXXXXXXXXXXXXX",
//         "senderId": "XXXXXXXXXXXXXXXXXXXXXXX",
//         "message": "hello",
//         "timestamp": "2021-07-01T12:54:52.876Z"
//     }
// }
*/

const postMessage = async (req, res) => {
    if (!req.body.message) {
        return res.status(400).json(errorFunction(true, "message is required"));
    }
    if (!req.params.chatId) {
        return res.status(400).json(errorFunction(true, "chat id is required"));
    }
    const { chatId } = req.params;
    const chatSessionDetail = await chatSession.findOne({ _id: chatId, status: 'ACTIVE' });
    if (!chatSessionDetail) {
        return res.status(400).json(errorFunction(true, "error", "Chat session not found"));
    }
    if (chatSessionDetail.status != 'ACTIVE') {
        return res.status(400).json(errorFunction(true, "error", "Chat session is not active"));
    }


    try {
        const messageBody = {
            sessionId: chatId,
            senderId: req.user.id,
            message: req.body.message
        }
        const message = await MessageModel.create(messageBody);
        res.status(200).json(errorFunction(false, "success", message));
    } catch (error) {
        res.status(500).json(errorFunction(true, "error", error));
    }
}

module.exports = {
    postChatSessionDetail,
    getChatSessionDetail,
    getPoolChatSessionDetail,
    putAcceptChatbyAgent,
    getAgentActiveChat,
    putEndChatbyAgent,
    postMessage
};