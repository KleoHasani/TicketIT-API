const request = require("supertest");
const { disconnect, connection, Document } = require("mongoose");
const { verifyAccessToken } = require("../src/helpers/token");
const { TICKET_TYPE } = require("../src/Models/Tickets.model");

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

  // add new project
  await request(m_app)
    .post("/api/projects/new")
    .set({ authorization: token })
    .send({
      project: "myproject",
    });

  // store project
  const newprojdata = await request(m_app)
    .get("/api/projects/")
    .set({ authorization: token });
  current_project = newprojdata.body.data[0];
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

describe("TICKETS ROUTE", () => {
  describe("POST - add new ticket to current project", () => {
    it("Should add a new ticket to current project", async (done) => {
      const body = await request(m_app)
        .post(
          "/api/projects/" + current_project._id.toString() + "/tickets/new"
        )
        .set({ authorization: token })
        .send({
          name: "myticket",
          ttype: TICKET_TYPE.TODO,
          content: "content...",
        });
      expect(body.status).toBe(201);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.msg).toBe("New ticket created");
      done();
    });

    it("Should add another new ticket to current project", async (done) => {
      const body = await request(m_app)
        .post(
          "/api/projects/" + current_project._id.toString() + "/tickets/new"
        )
        .set({ authorization: token })
        .send({
          name: "myticket2",
          ttype: 0,
        });
      expect(body.status).toBe(201);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.msg).toBe("New ticket created");
      done();
    });

    it("Should add a new ticket to current project with same name and type", async (done) => {
      const body = await request(m_app)
        .post(
          "/api/projects/" + current_project._id.toString() + "/tickets/new"
        )
        .set({ authorization: token })
        .send({
          name: "myticket",
          ttype: TICKET_TYPE.TODO,
        });
      expect(body.status).toBe(201);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.msg).toBe("New ticket created");
      done();
    });

    it("Should fail to add new ticket without name", async (done) => {
      const body = await request(m_app)
        .post(
          "/api/projects/" + current_project._id.toString() + "/tickets/new"
        )
        .set({ authorization: token })
        .send({
          name: "",
          ttype: TICKET_TYPE.TODO,
        });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Ticket name can not be empty");
      done();
    });

    it("Should fail to add new ticket without type", async (done) => {
      const body = await request(m_app)
        .post(
          "/api/projects/" + current_project._id.toString() + "/tickets/new"
        )
        .set({ authorization: token })
        .send({
          name: "myticket",
        });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Ticket type can not be empty");
      done();
    });

    it("Should fail to add new ticket with type other than (0, 1) | (TICKET_TYPE.TODO, TICKET_TYPE.BUG)", async (done) => {
      const body = await request(m_app)
        .post(
          "/api/projects/" + current_project._id.toString() + "/tickets/new"
        )
        .set({ authorization: token })
        .send({
          name: "myticket",
          ttype: 2,
        });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Ticket type must be a valid type");
      done();
    });

    it("Should fail to add new ticket with type other than (0, 1) | (TICKET_TYPE.TODO, TICKET_TYPE.BUG) | or invalid", async (done) => {
      const body = await request(m_app)
        .post(
          "/api/projects/" + current_project._id.toString() + "/tickets/new"
        )
        .set({ authorization: token })
        .send({
          name: "myticket",
          ttype: "2",
        });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Ticket type must be a valid type");
      done();
    });

    it("Should fail to add new ticket without token", async (done) => {
      const body = await request(m_app)
        .post(
          "/api/projects/" + current_project._id.toString() + "/tickets/new"
        )
        .send({
          name: "myticket",
          ttype: TICKET_TYPE.TODO,
        });
      expect(body.status).toBe(401);
      done();
    });

    it("Should fail to add new ticket with bad token", async (done) => {
      const body = await request(m_app)
        .post(
          "/api/projects/" + current_project._id.toString() + "/tickets/new"
        )
        .set({ authorization: "bad token" });
      expect(body.status).toBe(401);
      done();
    });
  });
});
