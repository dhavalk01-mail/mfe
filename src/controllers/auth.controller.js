const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const errorFunction = require("../utils/errorFunction");
const { securePassword, comparePassword } = require("../utils/securePassword");
const Joi = require("joi");
const UserDetail = require("../models/userdetail.model");

const signup = async (req, res) => {
    try {
        const existingUser = await User.findOne({
            email: req.body.email,
        }).lean(true);
        if (existingUser) {
            return res.status(403).json(errorFunction(true, "User Already Exists"));
        } else {
            const hashedPassword = await securePassword(req.body.password);
            const newUser = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role,
                is_active: req.body.is_active,
            });
            if (newUser) {
                try{
                    req.body.userId = newUser._id;
                    await UserDetail.create(req.body);
                } catch(error) {
                    res.status(500).json(errorFunction(true, "Error Adding user details", error.message));
                }
                res.status(201).json(errorFunction(false, "User Created", newUser));
            } else {
                res.status(403).json(errorFunction(true, "Error Creating User", error.message));
            }
        }
    } catch (error) {
        res.status(500).json(errorFunction(true, "Error Adding user", error.message));
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //check if user exist
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json(errorFunction(true, "Account not found"));
        }

        //compare the password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json(errorFunction(true, "Invalid password"));
        }

        //Generate token
        const token = jwt.sign({
            id: user._id,
            email,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        //send token
        res.status(200).send({ token: token });

    } catch (error) {
        console.error(error);
        res.status(500).json(errorFunction(true, "error", error.message));
    }
};


const validateUser = (user) =>
    Joi.object({
        username: Joi.string().alphanum().min(3).max(25).trim(true).required(),
        email: Joi.string().email().trim(true).required(),
        password: Joi.string().min(8).trim(true).required(),
        role: Joi.string().default("USER").required(),
        is_active: Joi.boolean().default(true),
    }).validate(user);

module.exports = { signup, login, validateUser };