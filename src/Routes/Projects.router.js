("use strict");
const { Router } = require("express");

const {
  createProject,
  getAllProjects,
  getProject,
  updateTeam,
  updateProjectName,
} = require("../Controllers/Projects.controller");

const {
  createTicket,
  updateName,
  updateType,
  updateContent,
  deleteTicket,
  assignTicket,
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
 * @desc Patch Update ticket name
 * @route /api/projects/:projectID/tickets/update/name
 */
router.patch(
  "/:projectID/tickets/update/name",
  [validateTicketName, results],
  updateName
);

/**
 * @desc Patch Update ticket type
 * @route /api/projects/:projectID/tickets/update/type
 */
router.patch(
  "/:projectID/tickets/update/type",
  [validateTicketType, results],
  updateType
);

/**
 * @desc Patch Update ticket content
 * @route /api/projects/:projectID/tickets/update/content
 */
router.patch("/:projectID/tickets/update/content", updateContent);

/**
 * @desc Delete Update ticket content
 * @route /api/projects/:projectID/tickets/:ticketID/delete
 */
router.delete("/:projectID/tickets/:ticketID/delete", deleteTicket);

/**
 * @desc Patch Assign ticket to user
 * @route /api/projects/:projectID/tickets/update/assign
 */
router.patch(
  "/:projectID/tickets/:ticketID/update/assign",
  [validateTicketAssigned, results],
  assignTicket
);

module.exports = router;
