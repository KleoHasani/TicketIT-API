("use strict");
const { Router } = require("express");
const { auth } = require("../middleware/auth");

// Controller Import
const { register, login, refresh } = require("../Controllers/Auth.controller");

// Middleware imports
const {
  validateRegister,
  validateLogin,
  results,
} = require("../middleware/validator");

const router = Router();

/**
 * @desc POST Register route
 * @route /api/auth/register
 */
router.post("/register", [validateRegister, results], register);

/**
 * @desc POST Login route
 * @route /api/auth/login
 */
router.post("/login", [validateLogin, results], login);

/**
 * @desc GET Refresh route
 * @route /api/auth/refresh-token
 */
router.get("/refresh-token", refresh);

module.exports = router;
