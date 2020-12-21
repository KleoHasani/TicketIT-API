const request = require("supertest");
const { disconnect, connection, Document } = require("mongoose");

const { m_app } = require("../src/app");

let server = null;
let token = null;
let project = null;

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
  done();
});

afterAll(async (done) => {
  server.close(done);
  await connection.db.dropDatabase();
  await disconnect();
  server = null;
  token = null;
  project = null;
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
  });

  // get all projects should get one since we added one on previous test.
  describe("GET - All projects Endpoint", () => {
    it("Should return array of projects", async (done) => {
      const body = await request(m_app)
        .get("/api/projects/")
        .set({ authorization: token });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.data.length).toBeGreaterThanOrEqual(0);
      project = body.body.data[0];
      expect(project).not.toBeNull();
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
        .get("/api/projects/" + project._id.toString())
        .set({ authorization: token });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.data._id.toString()).toBe(project._id.toString());
      expect(body.body.data.name).toBe("myproject");
      expect(body.body.data.creator.toString()).toBe(
        body.body.data.team[0].toString()
      );
      done();
    });

    it("Should fail to return project without token", async (done) => {
      const body = await request(m_app).get(
        "/api/projects/" + project._id.toString()
      );
      expect(body.status).toBe(401);
      done();
    });

    it("Should fail to return project with bad token", async (done) => {
      const body = await request(m_app)
        .get("/api/projects/" + project._id.toString())
        .set({ authorization: "bad token" });
      expect(body.status).toBe(401);
      done();
    });
  });

  // update team per project ID
  //describe("PATCH - update team by project id", () => {});
});
