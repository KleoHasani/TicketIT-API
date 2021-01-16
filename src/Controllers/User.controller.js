("use strict");
const { Request, Response } = require("express");

const { remove } = require("../Models/Blacklist.model");
const { getUserByID } = require("../Models/User.model");

module.exports = {
  /**
   * @param {Request} m_req
   * @param {Response} m_res
   * @returns {Object}
   */
  logout: async (m_req, m_res) => {
    try {
      await remove(m_req.user);
      m_req.logout();
      //m_req.user = null;
      return m_res.status(200).json({
        status: 200,
        desc: "PASS",
        msg: "Logged out",
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

  /**
   * @param {Request} m_req
   * @param {Response} m_res
   * @returns {Object}
   */
  getUser: async (m_req, m_res) => {
    try {
      const m_user = await getUserByID(m_req.user.toString());
      return m_res.status(200).json({
        status: 200,
        desc: "PASS",
        msg: null,
        data: m_user,
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
};
