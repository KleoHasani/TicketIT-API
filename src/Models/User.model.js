("use strict");
const { Schema, model } = require("mongoose");
const { encrypt, validate } = require("../helpers/encrypt");
const createError = require("http-errors");

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

const UserModel = model("User", UserSchema, "tblUsers");

module.exports = {
  /**
   * @param {string} m_firstname
   * @param {string} m_lastname
   * @param {string} m_email
   * @param {string} m_password
   */
  newUser: async (m_firstname, m_lastname, m_email, m_password) => {
    try {
      const m_pass = await encrypt(m_password);
      const m_user = new UserModel({
        firstname: m_firstname,
        lastname: m_lastname,
        email: m_email,
        password: m_pass,
      });
      await m_user.save();
    } catch (err) {
      console.error(err);
      if (err.code === 11000)
        throw createError.BadRequest("Email already exists");
      throw createError.InternalServerError("Unable to register");
    }
  },

  /**
   * @param {string} m_email
   * @param {string} m_password
   * @returns {string}
   */
  authenitcateUser: async (m_email, m_password) => {
    try {
      const m_user = await UserModel.findOne({ email: m_email });
      if (!m_user)
        throw createError.BadRequest("Email or password does not match");
      const isMatch = await validate(m_password, m_user.password);
      if (!isMatch)
        throw createError.BadRequest("Email or password does not match");
      return m_user._id;
    } catch (err) {
      console.error(err);
      if (err.status === 400) throw err;
      throw createError.InternalServerError("Unable to login");
    }
  },

  validateUser: async (id) => {
    try {
      const m_user = await UserModel.findById(id);
      if (!m_user) throw createError.BadRequest("Unable to find user");
      return m_user._id;
    } catch (err) {
      console.error(err);
      if (err.status === 400) throw err;
      throw createError.InternalServerError("Unable to validate user");
    }
  },
};
