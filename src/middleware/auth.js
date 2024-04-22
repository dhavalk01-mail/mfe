const jwt = require("jsonwebtoken");
const errorFunction = require("./../utils/errorFunction");
const User = require("./../models/user.model");


const verifyToken = async (req, res, next) => {
    //get the token from requrest headers
    const token = req.headers?.authorization;
    // console.log(req.headers?.authorization);

    //check if token exists
    if (!token) {
        return res.status(401).json(errorFunction(true, "No token provided"));
    }

    try {
        //verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // check is user exist in our database or not
        // const user = await User.findOne({ email: decoded.email });
        const user = await User.findById(decoded.id);
        if (decoded && user) {
            //Attach the decoded token to the request object
            req.user = decoded;
            //Call the next middleware
            next();
        } else {
            return res.status(401).json(errorFunction(true, "Authentication token is invalid due to user is not exist."));
        }
    } catch (error) {
        return res.status(401).json(errorFunction(true, "Invalid token", error));
    }
}

module.exports = verifyToken;