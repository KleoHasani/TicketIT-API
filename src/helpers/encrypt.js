("use strict");
const { compare, hash, genSalt } = require("bcrypt");
const createError = require("http-errors");

module.exports = {
  /**
   * @param {string} m_data
   * @returns {string | null}
   */
  encrypt: async (m_data) => {
    if (!m_data || typeof m_data !== "string") return null;
    try {
      const m_salt = await genSalt(10);
      return await hash(m_data, m_salt);
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  /**
   * @param {string} m_data
   * @param {string} m_hash
   * @returns {boolean}
   */
  validate: async (m_data, m_hash) => {
    try {
      return await compare(m_data, m_hash);
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};
