const express = require("express");

const auth = require("../controllers/auth.controller");
// const { validateUser } = require("../models/user.model");
//LOG MIDDLEWARE
const validateBody = require("./../utils/validateBody");

const router = express.Router();


//AUTH ROUTES

/** POST Methods */

router.post("/signup", validateBody(auth.validateUser), auth.signup);


/**
 * @swagger
 * /api/login:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Login a user
 *    description: Login a user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: Successful login
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                user:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                    email:
 *                      type: string
 *                    name:
 *                      type: string
 *                    role:
 *                      type: string
 *      400:
 *        description: Invalid email or password
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Invalid email or password"
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Internal server error"
 * 
 */
router.post("/login", auth.login);

module.exports = router