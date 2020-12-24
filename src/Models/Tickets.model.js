("use strict");
const { Schema, model } = require("mongoose");
const createError = require("http-errors");

const TICKET_TYPE = {
  TODO: 0,
  BUG: 1,
};

const TicketsSchema = new Schema({
  creator: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
    default: "",
  },
  ttype: {
    type: Number,
    min: 0,
    max: 1,
    required: true,
  },
  assigned: [
    {
      type: String,
      required: false,
      default: [],
    },
  ],
  created: {
    type: Date,
    default: Date.now(),
  },
});

const TicketsModel = model("Tickets", TicketsSchema, "tblTickets");

module.exports = {
  TICKET_TYPE,

  /**
   * @param {string} m_creator
   * @param {string} m_project
   * @param {string} m_name
   * @param {TICKET_TYPE} m_type
   * @param {string} m_content
   */
  createNewTicket: async (m_creator, m_project, m_name, m_type, m_content) => {
    try {
      const m_ticket = new TicketsModel({
        creator: m_creator,
        project: m_project,
        name: m_name,
        ttype: m_type,
        content: m_content,
      });
      await m_ticket.save();
    } catch (err) {
      console.error(err);
      throw createError.InternalServerError("Unable to create new ticket");
    }
  },

  /**
   * @param {string} m_creator
   * @param {string} m_project
   * @param {string} m_name
   */
  updateTicketName: async (m_creator, m_project, m_name) => {
    try {
      const m_update = await TicketsModel.findOneAndUpdate(
        {
          creator: m_creator,
          project: m_project,
        },
        { name: m_name }
      );
      if (!m_update) throw createError.BadRequest("Not allowed to update");
    } catch (err) {
      console.error(err);
      if (err.status === 400) throw err;
      throw createError.InternalServerError("Unable to update ticket name");
    }
  },

  /**
   * @param {string} m_creator
   * @param {string} m_project
   * @param {TICKET_TYPE} m_type
   */
  updateTicketType: async (m_creator, m_project, m_type) => {
    try {
      const m_update = await TicketsModel.findOneAndUpdate(
        {
          creator: m_creator,
          project: m_project,
        },
        { ttype: m_type }
      );
      if (!m_update) throw createError.BadRequest("Not allowed to update");
    } catch (err) {
      console.error(err);
      if (err.status === 400) throw err;
      throw createError.InternalServerError("Unable to update ticket type");
    }
  },

  /**
   * @param {string} m_creator
   * @param {string} m_project
   * @param {TICKET_TYPE} m_type
   */
  updateTicketContent: async (m_creator, m_project, m_content) => {
    try {
      const m_update = await TicketsModel.findOneAndUpdate(
        {
          creator: m_creator,
          project: m_project,
        },
        { content: m_content }
      );
      if (!m_update) throw createError.BadRequest("Not allowed to update");
    } catch (err) {
      console.error(err);
      if (err.status === 400) throw err;
      throw createError.InternalServerError("Unable to update ticket content");
    }
  },

  /**
   * @param {string} m_ticketID
   * @param {string} m_creator
   * @param {string} m_project
   * @param {[string]} m_assign
   */
  assignTicketToUser: async (m_ticketID, m_creator, m_project, m_assign) => {
    try {
      const m_updated = await TicketsModel.findOneAndUpdate(
        { _id: m_ticketID, creator: m_creator, project: m_project },
        { assigned: m_assign }
      );
      if (!m_updated)
        throw createError.BadRequest("Unable to assign user to ticket");
    } catch (err) {
      console.error(err);
      if (err.status === 400) throw err;
      throw createError.InternalServerError("Unable to update ticket");
    }
  },

  /**
   * @param {string} m_ticketID
   * @param {string} m_creator
   * @param {string} m_project
   */
  deleteTicketByTicketID: async (m_ticketID, m_creator, m_project) => {
    try {
      const m_deleted = await TicketsModel.findOneAndDelete({
        _id: m_ticketID,
        creator: m_creator,
        project: m_project,
      });

      if (!m_deleted) throw createError.BadRequest("Ticket was not deleted");
    } catch (err) {
      console.error(err);
      if (err.status === 400) throw err;
      throw createError.InternalServerError("Unable to delete ticket");
    }
  },
};
