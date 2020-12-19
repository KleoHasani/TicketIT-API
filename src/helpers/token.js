("use strict");
const { sign, verify } = require("jsonwebtoken");
const createError = require("http-errors");
const { set } = require("../Models/Blacklist.model");

module.exports = {
  /**
   * @param {string} m_payload
   * @returns {string}
   */
  signAccessToken: (m_payload) => {
    return sign({ payload: m_payload }, process.env.ACCESS_TOKEN, {
      algorithm: "HS512",
      audience: m_payload.toString(),
      expiresIn: "30m",
      issuer: "TICKETIT-API",
    });
  },

  /**
   * @param {string} m_payload
   * @returns {string}
   */
  signRefreshToken: async (m_payload) => {
    try {
      const m_token = sign({ payload: m_payload }, process.env.REFRESH_TOKEN, {
        algorithm: "HS512",
        audience: m_payload.toString(),
        expiresIn: "1w",
        issuer: "TICKETIT-API",
      });
      await set(m_payload, m_token);
      return m_token;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  /**
   * @param {string} m_token
   * @returns {string | object}
   */
  verifyAccessToken: (m_token) => {
    return verify(m_token, process.env.ACCESS_TOKEN, {
      algorithms: ["HS512"],
      issuer: "TICKETIT-API",
    });
  },

  /**
   * @param {string} m_token
   * @returns {string | object}
   */
  verifyRefreshToken: (m_token) => {
    try {
      return verify(m_token, process.env.REFRESH_TOKEN, {
        algorithms: ["HS512"],
        issuer: "TICKETIT-API",
      });
    } catch (err) {
      console.error(err);
      throw createError.Unauthorized("Invalid token");
    }
  },
};
