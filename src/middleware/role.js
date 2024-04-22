const errorFunction = require("./../utils/errorFunction");

const isAdmin = async(req, res, next) => {
    if (req.user.role !== 'ADMIN') res.status(403).json(errorFunction(true, "Access denided - (Admin Access require)"))

    next();
}

const isAgent = async(req, res, next) => {
    if (req.user.role !== 'AGENT') res.status(403).json(errorFunction(true, "Access denided - (Agent Access require)"))

    next();
}

const isUser = async(req, res, next) => {
    if (req.user.role !== 'USER') res.status(403).json(errorFunction(true, "Access denided - (User Access require)"))

    next();
}

// const isCurrentUser = async (req, res, next) => {
//     let user;
//     try {
//         user = await User.findOne({ email: req.user.email });
//         if (!user) {
//             return res.status(404).json(errorFunction(true, "You cannot do this openeration with current user."));
//         }
//         else if (req.params.id === user._id) {
//             return res.status(404).json(errorFunction(true, "You cannot do this openeration with current user."));
//         } else {
//             next();
//             // return res.status(200).json(errorFunction(false, { user }));
//         }
//     } catch (error) {
//         res.status(400).json(errorFunction(true, "Error fetching user", error));
//     }
// }

// const currentUser = async (req, res) => {
//     try {
//         var user = await User.findOne({ email: req.user.email });
//         res.status(200).json(errorFunction(false, 'Success', user));
//     } catch (error) {
//         return res.status(400).json(errorFunction(true, "User profile not found", error));
//     }
// };

module.exports = { 
    isAdmin,
    isAgent,
    isUser
}