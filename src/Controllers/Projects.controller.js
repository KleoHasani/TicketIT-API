("use strict");
const { Request, Response } = require("express");
const { Document } = require("mongoose");

const {
  createNewProject,
  getAllProjectsByUser,
  getProjectByID,
  updateTeamByProjectID,
  renameProjectByProjectID,
  deleteProjectByProjectID,
} = require("../Models/Projects.model");

module.exports = {
  /**
   * @param {Request} m_req
   * @param {Response} m_res
   * @returns {[Document]}
   */
  getAllProjects: async (m_req, m_res) => {
    try {
      const projects = await getAllProjectsByUser(m_req.user);
      return m_res.status(200).json({
        status: 200,
        desc: "PASS",
        msg: "",
        data: projects,
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
   * @returns {Document}
   */
  getProject: async (m_req, m_res) => {
    try {
      const m_project = await getProjectByID(
        m_req.params.projectID,
        m_req.user.toString()
      );
      if (!m_project)
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
        data: m_project,
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
  createProject: async (m_req, m_res) => {
    const { project } = m_req.body;

    try {
      const m_project = await createNewProject(m_req.user, project, [
        m_req.user,
      ]);
      return m_res.status(201).json({
        status: 201,
        desc: "PASS",
        msg: "Project created",
        data: m_project,
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
  deleteProject: async (m_req, m_res) => {
    try {
      await deleteProjectByProjectID(
        m_req.user,
        m_req.params.projectID.toString()
      );
      return m_res.status(200).json({
        status: 201,
        desc: "PASS",
        msg: "Project deleted",
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
  updateTeam: async (m_req, m_res) => {
    const { team } = m_req.body;
    try {
      // Check project manager / project creator can not remove self from team
      if (team.indexOf(m_req.user.toString()) === -1)
        return m_res.status(200).json({
          status: 200,
          desc: "FAIL",
          msg: "That action is not allowed",
          data: null,
        });
      await updateTeamByProjectID(
        m_req.params.projectID,
        m_req.user.toString(),
        team
      );
      return m_res.status(200).json({
        status: 200,
        desc: "PASS",
        msg: "Team updated",
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
  updateProjectName: async (m_req, m_res) => {
    const { project } = m_req.body;
    try {
      await renameProjectByProjectID(
        m_req.params.projectID,
        m_req.user.toString(),
        project
      );
      return m_res.status(200).json({
        status: 200,
        desc: "PASS",
        msg: "Project renamed",
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
