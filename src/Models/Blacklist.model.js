("use strict");
const { Schema, model } = require("mongoose");
const { encrypt, validate } = require("../helpers/encrypt");
const createError = require("http-errors");

const BlacklistSchema = new Schema({
  user: {
    type: String,
    unique: true,
    required: true,
  },
  refresh: {
    type: String,
    unique: true,
    required: true,
  },
});

const BlacklistModel = model("Blacklist", BlacklistSchema, "tblBlacklist");

module.exports = {
  /**
   * @param {string} m_user
   * @param {string} m_token
   */
  set: async (m_user, m_token) => {
    try {
      const m_data = await encrypt(m_token);

      const m_exists = await BlacklistModel.findOne({ user: m_user });
      if (m_exists) await m_exists.updateOne({ refresh: m_data });
      else
        await new BlacklistModel({
          user: m_user,
          refresh: m_data,
        }).save();
    } catch (err) {
      console.error(err);
      throw createError.InternalServerError("Unable to set");
    }
  },

  /**
   * @param {string} m_user
   * @param {string} m_token
   * @returns {boolean}
   */
  validRefresh: async (m_user, m_token) => {
    try {
      const m_exists = await BlacklistModel.findOne({ user: m_user });
      if (!m_exists) throw createError.BadRequest("User does not exists");
      return await validate(m_token, m_exists.refresh);
    } catch (err) {
      console.error(err);
      if (err.status === 400) throw err;
      throw createError.InternalServerError("Unable to get");
    }
  },

  /**
   * @param {string} m_user
   */
  remove: async (m_user) => {
    try {
      await BlacklistModel.findOneAndDelete({ user: m_user });
    } catch (err) {
      console.error(err);
      throw createError.InternalServerError("Unable to remove");
    }
  },
};
