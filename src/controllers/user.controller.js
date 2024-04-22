const User = require('./../models/user.model');
// const UserDetail = require('../models/userdetail.model');
const ObjectId = require('mongodb').ObjectId;

const errorFunction = require("./../utils/errorFunction");


const user = async (req, res) => {
    try {
        var user = User.aggregate([
            { $match: { _id: new ObjectId(req.user.id) } },
            { $lookup: { from: 'userdetails', localField: '_id', foreignField: 'userId', as: 'userdetails' } },
            { $unwind: '$userdetails' },
        ]);
        user = await user.exec();
        user = user[0];
        delete user.password;
        delete user.__v;
        delete user.userdetails.__v;
        
        res.status(200).json(errorFunction(false, 'Success', user));
    } catch (error) {
        return res.status(400).json(errorFunction(true, "User profile not found", error.message));
    }
};

module.exports = user;