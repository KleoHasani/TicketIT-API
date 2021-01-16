("use strict");
const { Request, Response } = require("express");
const createError = require("http-errors");
const { newUser, authenitcateUser } = require("../Models/User.model");
const { validRefresh } = require("../Models/Blacklist.model");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/token");

module.exports = {
  /**
   * @param {Request} m_req
   * @param {Response} m_res
   */
  register: async (m_req, m_res) => {
    const { firstname, lastname, email, password } = m_req.body;

    try {
      await newUser(firstname, lastname, email, password);
      return m_res.status(201).json({
        status: 201,
        desc: "PASS",
        msg: "User created",
        data: null,
      });
    } catch (err) {
      console.error(err);
      if (err.status === 400)
        return m_res.status(200).json({
          status: 200,
          desc: "FAIL",
          msg: err.message,
          data: null,
        });
      return m_res.status(err.status).json({
        status: err.status,
        desc: "FAIL",
        msg: err.message,
        data: null,
      });
    }
  },

  /**
   * @param {Request} m_req
   * @param {Response} m_res
   */
  login: async (m_req, m_res) => {
    const { email, password } = m_req.body;

    try {
      const m_id = await authenitcateUser(email, password);
      const m_access = signAccessToken(m_id);
      const m_refresh = await signRefreshToken(m_id);
      m_res.setHeader("authorization", "Bearer " + m_access);
      m_res.setHeader("x-refresh", m_refresh);
      return m_res.status(200).json({
        status: 200,
        desc: "PASS",
        msg: "Authentication successful",
        data: m_id,
      });
    } catch (err) {
      console.error(err);
      if (err.status === 400)
        return m_res.status(200).json({
          status: 200,
          desc: "FAIL",
          msg: " Email or password does not match",
          data: null,
        });
      return m_res.status(err.status).json({
        status: err.status,
        desc: "FAIL",
        msg: err.message,
        data: null,
      });
    }
  },

  /**
   * @param {Request} m_req
   * @param {Response} m_res
   */
  refresh: async (m_req, m_res) => {
    try {
      const m_refresh = m_req.headers["x-refresh"];
      if (!m_refresh) throw createError.BadRequest("No token provided");
      const m_id = verifyRefreshToken(m_refresh);
      const isValid = validRefresh(m_id.payload, m_refresh);
      if (!isValid) throw createError.Unauthorized("Invalid token");
      const m_access = signAccessToken(m_id.payload);
      m_res.setHeader("authorization", "Bearer " + m_access);
      return m_res.status(200).json({
        status: 200,
        desc: "PASS",
        msg: "Token updated",
        data: null,
      });
    } catch (err) {
      console.error(err);
      return m_res.status(err.status).json({
        status: err.status,
        desc: "FAIL",
        msg: err.message,
        data: null,
      });
    }
  },
};
