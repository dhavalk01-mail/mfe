const express = require("express");
const user = require("./../controllers/user.controller");
const userdetail = require("./../controllers/userdetail.controller");


const router = express.Router();

//** USER ROUTES **//

// GET /user: Retrieving a user’s profile (restricted to the user themselves)
router.get("/user", user);

//user detail routes
router.post("/userdetail", userdetail.saveOrUpdateUserDetails);

module.exports = router;