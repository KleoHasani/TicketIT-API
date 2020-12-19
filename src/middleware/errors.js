("use strict");
const { Request, Response, NextFunction } = require("express");
const createError = require("http-errors");
/**
 *
 * @param {Request} m_req
 * @param {Response} m_res
 * @param {NextFunction} m_next
 */
async function notFound(m_req, m_res, m_next) {
  m_next(createError.NotFound());
}

/**
 * @param {any} m_err
 * @param {Request} m_req
 * @param {Response} m_res
 * @param {NextFunction} m_next
 */
function handleError(m_err, m_req, m_res, m_next) {
  return m_res.status(m_err.status || 500).json({
    status: m_err.status,
    desc: "FAIL",
    msg: m_err.message,
    data: null,
  });
}

module.exports = { notFound, handleError };
