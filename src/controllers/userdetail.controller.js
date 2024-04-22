const UserDetail = require('./../models/userdetail.model');
const User = require('./../models/user.model');
const errorFunction = require('../utils/errorFunction');

// save or update user details
const saveOrUpdateUserDetails = async (req, res) => {
    try {
        // find user by email id
        const user = await User.findOne({ email: req.user.email }).lean(true);

        if (user) {
            try {
                req.body.userId = user._id;

                var query = { userId: user._id };
                var data = {
                    $set: req.body,
                };
                const userdetails = await UserDetail.findOneAndUpdate(query, data , {
                    upsert: true,
                    new: true,
                });
                return res.status(200).json(errorFunction(false, "User details saved successfully", userdetails));
            } catch (error) {
                console.log(error);
                // return res.status(400).json(errorFunction(true, "Error updating user details", error));
            }
        }
    } catch (error) {
        return res.status(404).json(errorFunction(res, 'User not found', error));
    }
}

module.exports = { saveOrUpdateUserDetails };