("use strict");
const { Router } = require("express");

// Controller Import
const { logout, getUser } = require("../Controllers/User.controller");

const router = Router();

/**
 * @desc DELETE Logout route
 * @route /api/user/logout
 */
router.delete("/logout", logout);

/**
 * @desc POST get user
 * @route /api/user/account
 */
router.get("/account", getUser);

module.exports = router;
