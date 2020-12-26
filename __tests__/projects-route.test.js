const request = require("supertest");
const { disconnect, connection, Document } = require("mongoose");
const { verifyAccessToken } = require("../src/helpers/token");

const { m_app } = require("../src/app");

let server = null;
let token = null;
let detokenized = null;
let current_project = null;

beforeAll(async (done) => {
  server = m_app.listen(3000);

  // create new user
  await request(m_app).post("/api/auth/register").send({
    firstname: "Admin",
    lastname: "Lastname",
    email: "admin@admin.com",
    password: "admin123",
  });

  // login as user
  const body = await request(m_app).post("/api/auth/login").send({
    email: "admin@admin.com",
    password: "admin123",
  });

  // get user token
  token = body.headers["authorization"];

  // detokenize token
  detokenized = verifyAccessToken(token.split(" ")[1]);
  done();
});

afterAll(async (done) => {
  server.close(done);
  await connection.db.dropDatabase();
  await disconnect();
  server = null;
  token = null;
  detokenized = null;
  current_project = null;
});

describe("PROJECTS ROUTE", () => {
  // add new project
  describe("POST - Add new project", () => {
    it("Should add a new project", async (done) => {
      const body = await request(m_app)
        .post("/api/projects/new")
        .set({ authorization: token })
        .send({
          project: "myproject",
        });
      expect(body.status).toBe(201);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.msg).toBe("Project created");
      done();
    });

    it("Should fail to add a new project with same name", async (done) => {
      const body = await request(m_app)
        .post("/api/projects/new")
        .set({ authorization: token })
        .send({
          project: "myproject",
        });
      expect(body.status).toBe(400);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Project name is already taken");
      done();
    });

    it("Should fail to add a new project without project name", async (done) => {
      const body = await request(m_app)
        .post("/api/projects/new")
        .set({ authorization: token })
        .send({
          project: "",
        });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Project name can not be empty");
      done();
    });

    it("Should fail to add a new project without token", async (done) => {
      const body = await request(m_app).post("/api/projects/new").send({
        project: "myproject",
      });
      expect(body.status).toBe(401);
      done();
    });

    it("Should fail to add a new project with bad token", async (done) => {
      const body = await request(m_app)
        .post("/api/projects/new")
        .set({ authorization: "bad token" })
        .send({
          project: "myproject",
        });
      expect(body.status).toBe(401);
      done();
    });
  });

  // get all projects should get one since we added one on previous test.
  describe("GET - All projects endpoint", () => {
    it("Should return array of projects", async (done) => {
      const body = await request(m_app)
        .get("/api/projects/")
        .set({ authorization: token });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.data.length).toBeGreaterThanOrEqual(0);
      current_project = body.body.data[0];
      expect(current_project).not.toBeNull();
      done();
    });

    it("Should fail to return array of projects without token", async (done) => {
      const body = await request(m_app).get("/api/projects/");
      expect(body.status).toBe(401);
      done();
    });

    it("Should fail to return array of projects with bad token", async (done) => {
      const body = await request(m_app)
        .get("/api/projects/")
        .set({ authorization: "bad token" });
      expect(body.status).toBe(401);
      done();
    });
  });

  // get project by project id
  describe("GET - project by project id", () => {
    it("Should return project", async (done) => {
      const body = await request(m_app)
        .get("/api/projects/" + current_project._id.toString())
        .set({ authorization: token });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.data._id.toString()).toBe(
        current_project._id.toString()
      );
      expect(body.body.data.name).toBe("myproject");
      expect(body.body.data.creator.toString()).toBe(
        body.body.data.team[0].toString()
      );
      done();
    });

    it("Should fail to return project without token", async (done) => {
      const body = await request(m_app).get(
        "/api/projects/" + current_project._id.toString()
      );
      expect(body.status).toBe(401);
      done();
    });

    it("Should fail to return project with bad token", async (done) => {
      const body = await request(m_app)
        .get("/api/projects/" + current_project._id.toString())
        .set({ authorization: "bad token" });
      expect(body.status).toBe(401);
      done();
    });
  });

  // update team per project ID
  describe("PATCH - update team by project id", () => {
    it("Should update team array to include (self, and 'newuserid')", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" + current_project._id.toString() + "/update/team"
        )
        .set({ authorization: token })
        .send({
          team: [detokenized.payload, "newuserid"],
        });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.msg).toBe("Team updated");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should update team array to include only (self)", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" + current_project._id.toString() + "/update/team"
        )
        .set({ authorization: token })
        .send({
          team: [detokenized.payload],
        });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.msg).toBe("Team updated");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should fail to update team array without (self)", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" + current_project._id.toString() + "/update/team"
        )
        .set({ authorization: token })
        .send({
          team: ["newuserid"],
        });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("That action is not allowed");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should fail to update team array with empty string data", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" + current_project._id.toString() + "/update/team"
        )
        .set({ authorization: token })
        .send({
          team: [""],
        });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Must have at least one team member");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should fail to update team array with empty array", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" + current_project._id.toString() + "/update/team"
        )
        .set({ authorization: token })
        .send({
          team: [],
        });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Must have at least one team member");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should fail to update team array with no data", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" + current_project._id.toString() + "/update/team"
        )
        .set({ authorization: token });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Must have at least one team member");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should fail to update team array without token", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" + current_project._id.toString() + "/update/team"
        )
        .send({
          team: [detokenized.payload],
        });
      expect(body.status).toBe(401);
      done();
    });

    it("Should fail to update team array with bad token", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" + current_project._id.toString() + "/update/team"
        )
        .set({ authorization: "bad token" })
        .send({
          team: [detokenized.payload],
        });
      expect(body.status).toBe(401);
      done();
    });
  });

  // update project name
  describe("PATCH - update team by project id", () => {
    it("Should update project name", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" + current_project._id.toString() + "/update/name"
        )
        .set({ authorization: token })
        .send({
          project: "renamed",
        });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.msg).toBe("Project renamed");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should fail to update project name with empty string", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" + current_project._id.toString() + "/update/name"
        )
        .set({ authorization: token })
        .send({
          project: "",
        });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Project name can not be empty");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should fail to update project name without token", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" + current_project._id.toString() + "/update/name"
        )
        .send({
          project: "renamed",
        });
      expect(body.status).toBe(401);
      done();
    });

    it("Should fail to update project name with bad token", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" + current_project._id.toString() + "/update/name"
        )
        .set({ authorization: "bad token" })
        .send({
          project: "renamed",
        });
      expect(body.status).toBe(401);
      done();
    });
  });
});
