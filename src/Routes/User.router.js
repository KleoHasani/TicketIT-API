("use strict");
const { Router } = require("express");
const { auth } = require("../middleware/auth");

// Controller Import
const { getUser } = require("../Controllers/User.controller");

const router = Router();

/**
 * @desc POST Register route
 * @route /api/user/:userID
 */
router.get("/:userID", getUser);

module.exports = router;
