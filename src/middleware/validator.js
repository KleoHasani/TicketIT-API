("use strict");
const { Request, Response, NextFunction } = require("express");
const { body, validationResult } = require("express-validator");

module.exports = {
  validateRegister: [
    body("firstname")
      .notEmpty()
      .withMessage("First name can not be empty")
      .isString()
      .withMessage("First name is not valid")
      .trim(),
    body("lastname")
      .notEmpty()
      .withMessage("Last name can not be empty")
      .isString()
      .withMessage("Last name is not valid")
      .trim(),
    body("email")
      .notEmpty()
      .withMessage("Email can not be empty")
      .isEmail()
      .normalizeEmail({ all_lowercase: true })
      .trim()
      .withMessage("Not a valid email"),
    body("password")
      .notEmpty()
      .withMessage("Password can not be empty")
      .isLength({ min: 8, max: 1024 })
      .trim()
      .withMessage("Password must contain at least 8 or more characters"),
  ],

  validateLogin: [
    body("email")
      .notEmpty()
      .withMessage("Email can not be empty")
      .isEmail()
      .normalizeEmail({ all_lowercase: true })
      .trim()
      .withMessage("Not a valid email"),
    body("password").notEmpty().withMessage("Password can not be empty").trim(),
  ],

  validateProjectName: [
    body("project")
      .notEmpty()
      .withMessage("Project name can not be empty")
      .trim(),
  ],

  validateAddTeam: [
    body("team")
      .notEmpty()
      .withMessage("Must have at least one team member")
      .isArray({ min: 1 }),
  ],

  validateNewTicket: [
    body("name").notEmpty().withMessage("Ticket name can not be empty"),
    body("ttype")
      .notEmpty()
      .withMessage("Ticket type can not be empty")
      .isInt({ min: 0, max: 1 })
      .withMessage("Ticket type must be a valid type"),
  ],

  validateTicketName: [
    body("name").notEmpty().withMessage("Ticket name can not be empty"),
  ],

  validateTicketType: [
    body("ttype")
      .notEmpty()
      .withMessage("Ticket type can not be empty")
      .isInt({ min: 0, max: 1 })
      .withMessage("Ticket type must be a valid type"),
  ],

  validateTicketAssigned: [body("assigned").isArray()],

  /**
   * @param {Request} m_req
   * @param {Response} m_res
   * @param {NextFunction} m_next
   */
  results: (m_req, m_res, m_next) => {
    const m_results = validationResult(m_req);
    if (!m_results.isEmpty())
      return m_res.status(200).json({
        status: 200,
        desc: "FAIL",
        msg: m_results.array()[0]["msg"],
        data: null,
      });
    else m_next();
  },
};
