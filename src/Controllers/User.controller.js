("use strict");
const { Request, Response } = require("express");
const { getUserByID } = require("../Models/User.model");
module.exports = {
  /**
   * @param {Request} m_req
   * @param {Response} m_res
   */
  getUser: async (m_req, m_res) => {
    try {
      const m_user = await getUserByID(m_req.params.userID.toString());
      return m_res.status(201).json({
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
