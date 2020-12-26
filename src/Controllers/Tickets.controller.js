("use strict");
const { Request, Response } = require("express");

const {
  createNewTicket,
  updateTicketName,
  updateTicketType,
  updateTicketContent,
  deleteTicketByTicketID,
  assignTicketToUser,
  getAllTicketsByProjectPerCreator,
  getTicketByTicketID,
} = require("../Models/Tickets.model");

module.exports = {
  /**
   * @param {Request} m_req
   * @param {Response} m_res
   */
  createTicket: async (m_req, m_res) => {
    const { name, ttype, content } = m_req.body;

    try {
      await createNewTicket(
        m_req.user.toString(),
        m_req.params.projectID,
        name,
        ttype,
        content
      );
      return m_res.status(201).json({
        status: 201,
        desc: "PASS",
        msg: "New ticket created",
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
   */
  getAllTickets: async (m_req, m_res) => {
    try {
      const m_tickets = await getAllTicketsByProjectPerCreator(
        m_req.params.projectID.toString(),
        m_req.user.toString()
      );
      return m_res.status(200).json({
        status: 200,
        desc: "PASS",
        msg: "",
        data: m_tickets,
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
   */
  getTicket: async (m_req, m_res) => {
    try {
      const m_ticket = await getTicketByTicketID(
        m_req.params.ticketID.toString(),
        m_req.user.toString(),
        m_req.params.projectID.toString()
      );
      if (!m_ticket)
        return m_res.status(200).json({
          status: 200,
          desc: "FAIL",
          msg: "No project found",
          data: null,
        });
      return m_res.status(200).json({
        status: 200,
        desc: "PASS",
        msg: "",
        data: m_ticket,
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
   */
  updateName: async (m_req, m_res) => {
    const { name } = m_req.body;

    try {
      await updateTicketName(
        m_req.params.ticketID.toString(),
        m_req.user.toString(),
        m_req.params.projectID.toString(),
        name
      );
      return m_res.status(200).json({
        status: 200,
        desc: "PASS",
        msg: "Ticket name updated",
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
   */
  updateType: async (m_req, m_res) => {
    const { ttype } = m_req.body;

    try {
      await updateTicketType(
        m_req.params.ticketID.toString(),
        m_req.user.toString(),
        m_req.params.projectID.toString(),
        ttype
      );
      return m_res.status(200).json({
        status: 200,
        desc: "PASS",
        msg: "Ticket type updated",
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
   */
  updateContent: async (m_req, m_res) => {
    const { content } = m_req.body;

    try {
      await updateTicketContent(
        m_req.params.ticketID.toString(),
        m_req.user.toString(),
        m_req.params.projectID.toString.toString(),
        content
      );
      return m_res.status(200).json({
        status: 200,
        desc: "PASS",
        msg: "Ticket content updated",
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
   */
  deleteTicket: async (m_req, m_res) => {
    try {
      await deleteTicketByTicketID(
        m_req.params.ticketID.toString(),
        m_req.user.toString(),
        m_req.params.projectID.toString()
      );
      return m_res.status(200).json({
        status: 200,
        desc: "PASS",
        msg: "Ticket deleted",
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
   */
  assignTicket: async (m_req, m_res) => {
    const { assigned } = m_req.body;

    try {
      await assignTicketToUser(
        m_req.params.ticketID.toString(),
        m_req.user.toString(),
        m_req.params.projectID.toString(),
        assigned
      );
      return m_res.status(200).json({
        status: 200,
        desc: "PASS",
        msg: "Ticket assigned",
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
