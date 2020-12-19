("use strict");
const { compare, hash, genSalt } = require("bcrypt");
const createError = require("http-errors");

module.exports = {
  /**
   * @param {string} m_data
   * @returns {string}
   */
  encrypt: async (m_data) => {
    try {
      const m_salt = await genSalt(10);
      return await hash(m_data, m_salt);
    } catch (err) {
      console.error(err);
      throw createError.InternalServerError("Unable to encrypt");
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
      throw createError.InternalServerError("Unable to validate");
    }
  },
};
