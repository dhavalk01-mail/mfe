const bcrypt = require("bcryptjs");

const securePassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};


const comparePassword = async (userEnteredPassword, userDBPassword) => {
    const isPasswordValid = await bcrypt.compare(userEnteredPassword, userDBPassword);
    return isPasswordValid;
}

module.exports = {securePassword, comparePassword};