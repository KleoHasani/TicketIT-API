("use strict");
const { Router } = require("express");

const {
  createProject,
  getAllProjects,
  getProject,
  updateTeam,
  updateProjectName,
  deleteProject,
} = require("../Controllers/Projects.controller");

const {
  createTicket,
  updateName,
  updateType,
  updateContent,
  deleteTicket,
  assignTicket,
  getAllTickets,
  getTicket,
} = require("../Controllers/Tickets.controller");

const {
  validateProjectName,
  validateAddTeam,
  validateNewTicket,
  validateTicketName,
  validateTicketType,
  validateTicketAssigned,
  results,
} = require("../middleware/validator");

const router = Router();

/**
 * @desc GET Get all projects from the current authorized account
 * @route /api/projects/
 */
router.get("/", getAllProjects);

/**
 * @desc GET Get project by project ID
 * @route /api/projects/:projectID
 */
router.get("/:projectID", getProject);

/**
 * @desc POST Create Project route
 * @route /api/projects/new
 */
router.post("/new", [validateProjectName, results], createProject);

/**
 * @desc DELETE Create Project route
 * @route /api/projects/:projectID/delete
 */
router.delete("/:projectID/delete", deleteProject);

/**
 * @desc PATCH Update teams array
 * @route /api/projects/:projectID/update/team
 */
router.patch("/:projectID/update/team", [validateAddTeam, results], updateTeam);

/**
 * @desc PATCH Rename project
 * @route /api/projects/:projectID/update/name
 */
router.patch(
  "/:projectID/update/name",
  [validateProjectName, results],
  updateProjectName
);

/**
 * @desc Patch Add new ticket to tickets array
 * @route /api/projects/:projectID/tickets/new
 */
router.post(
  "/:projectID/tickets/new",
  [validateNewTicket, results],
  createTicket
);

/**
 * @desc GET Get all tickets by project and creator
 * @route /api/projects/:projectID/tickets/
 */
router.get("/:projectID/tickets", getAllTickets);

/**
 * @desc GET Get ticket by ticket ID
 * @route /api/projects/:projectID/tickets/:ticketID
 */
router.get("/:projectID/tickets/:ticketID", getTicket);

/**
 * @desc PATCH Update ticket name
 * @route /api/projects/:projectID/tickets/:ticketID/update/name
 */
router.patch(
  "/:projectID/tickets/:ticketID/update/name",
  [validateTicketName, results],
  updateName
);

/**
 * @desc PATCH Update ticket type
 * @route /api/projects/:projectID/tickets/:ticketID/update/type
 */
router.patch(
  "/:projectID/tickets/:ticketID/update/type",
  [validateTicketType, results],
  updateType
);

/**
 * @desc PATCH Update ticket content
 * @route /api/projects/:projectID/tickets/:ticketID/update/content
 */
router.patch("/:projectID/tickets/:ticketID/update/content", updateContent);

/**
 * @desc PATCH Assign ticket to user
 * @route /api/projects/:projectID/tickets/update/assign
 */
router.patch(
  "/:projectID/tickets/:ticketID/update/assign",
  [validateTicketAssigned, results],
  assignTicket
);

/**
 * @desc DELETE Update ticket content
 * @route /api/projects/:projectID/tickets/:ticketID/delete
 */
router.delete("/:projectID/tickets/:ticketID/delete", deleteTicket);

module.exports = router;
