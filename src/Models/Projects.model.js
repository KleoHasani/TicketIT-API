("use strict");
const { Schema, model } = require("mongoose");
const createError = require("http-errors");

const ProjectsSchema = new Schema({
  creator: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  team: [
    {
      type: String,
      required: true,
    },
  ],

  created: {
    type: Date,
  },
});

const ProjectsModel = model("Projects", ProjectsSchema, "tblProjects");

module.exports = {
  /**
   * @param {string} m_creator
   * @returns {[Document]}
   */
  getAllProjectsByUser: async (m_creator) => {
    try {
      return await ProjectsModel.find({ creator: m_creator });
    } catch (err) {
      console.error(err);
      throw createError.InternalServerError("Unable to get projects");
    }
  },

  /**
   * @param {string} m_project
   * @returns {[Document]}
   */
  getProjectByID: async (m_project, m_creator) => {
    try {
      return await ProjectsModel.findOne({
        _id: m_project,
        creator: m_creator,
      });
    } catch (err) {
      console.error(err);
      throw createError.InternalServerError("Unable to get project");
    }
  },

  /**
   * @param {string} m_creator
   * @param {string} m_project
   * @param {[string]} m_team
   * @returns {Document}
   */
  createNewProject: async (m_creator, m_name, m_team) => {
    try {
      const project = new ProjectsModel({
        creator: m_creator,
        name: m_name,
        team: m_team,
        created: new Date(),
      });
      await project.save();
      return project;
    } catch (err) {
      console.error(err);
      if (err.code === 11000)
        throw createError.BadRequest("Project name is already taken");
      throw createError.InternalServerError("Unable to create new project");
    }
  },

  /**
   * @param {string} m_creator
   * @param {string} m_id
   */
  deleteProjectByProjectID: async (m_creator, m_projectID) => {
    try {
      const m_deleted = await ProjectsModel.findByIdAndDelete({
        _id: m_projectID,
        creator: m_creator,
      });

      if (!m_deleted) throw createError.BadRequest("Project was not deleted");
    } catch (err) {
      console.error(err);
      if (err.status === 400) throw err;
      throw createError.InternalServerError("Unable to delete project");
    }
  },

  /**
   * @param {string} m_project
   * @param {string} m_creator
   * @param {[string]} m_team
   */
  updateTeamByProjectID: async (m_project, m_creator, m_team) => {
    try {
      const m_update = await ProjectsModel.findOneAndUpdate(
        { _id: m_project, creator: m_creator },
        { team: m_team }
      );
      if (!m_update) throw createError.BadRequest("Not allowed to update");
    } catch (err) {
      console.error(err);
      if (err.status === 400) throw err;
      throw createError.InternalServerError("Unable to update team");
    }
  },

  /**
   * @param {string} m_project
   * @param {string} m_creator
   * @param {string} m_rename
   */
  renameProjectByProjectID: async (m_project, m_creator, m_rename) => {
    try {
      const m_projectsFound = await ProjectsModel.find({
        _id: m_project,
        creator: m_creator,
      });
      if (!m_projectsFound.length)
        throw createError.BadRequest("Not allowed to update");
      m_projectsFound.forEach((project) => {
        if (project.name === m_rename)
          throw createError.BadRequest("This name is already taken");
      });
      const m_found = await ProjectsModel.findOneAndUpdate(
        {
          _id: m_project,
          creator: m_creator,
        },
        { name: m_rename }
      );
      if (!m_found) throw createError.BadRequest("Not allowed to update");
    } catch (err) {
      console.error(err);
      if (err.status === 400) throw err;
      throw createError.InternalServerError("Unable to update team");
    }
  },
};
