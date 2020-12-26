const request = require("supertest");
const { disconnect, connection, Document } = require("mongoose");
const { verifyAccessToken } = require("../src/helpers/token");
const { TICKET_TYPE } = require("../src/Models/Tickets.model");

const { m_app } = require("../src/app");

let server = null;
let token = null;
let current_project = null;
let current_ticket = null;

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
  current_project = null;
  current_ticket = null;
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

  describe("GET - All tickets endpoint", () => {
    it("Should return array of tickets", async (done) => {
      const body = await request(m_app)
        .get("/api/projects/" + current_project._id.toString() + "/tickets/")
        .set({ authorization: token });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.data.length).toBeGreaterThanOrEqual(0);
      current_ticket = body.body.data[0];
      expect(current_ticket).not.toBeNull();
      done();
    });

    it("Should fail to return array of tickets without token", async (done) => {
      const body = await request(m_app).get(
        "/api/projects/" + current_project._id.toString() + "/tickets/"
      );
      expect(body.status).toBe(401);
      done();
    });

    it("Should fail to return array of tickets with bad token", async (done) => {
      const body = await request(m_app)
        .get("/api/projects/" + current_project._id.toString() + "/tickets/")
        .set({ authorization: "bad token" });
      expect(body.status).toBe(401);
      done();
    });
  });

  describe("GET - One ticket endpoint", () => {
    it("Should return array of tickets size of 1", async (done) => {
      const body = await request(m_app)
        .get(
          "/api/projects/" +
            current_project._id.toString() +
            "/tickets/" +
            current_ticket._id.toString()
        )
        .set({ authorization: token });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.data._id).toBe(current_ticket._id.toString());
      expect(body.body.data[0]).not.toBeNull();
      done();
    });

    it("Should fail to return ticket without token", async (done) => {
      const body = await request(m_app).get(
        "/api/projects/" +
          current_project._id.toString() +
          "/tickets/" +
          current_ticket._id.toString()
      );
      expect(body.status).toBe(401);
      done();
    });

    it("Should fail to return ticket with bad token", async (done) => {
      const body = await request(m_app)
        .get(
          "/api/projects/" +
            current_project._id.toString() +
            "/tickets/" +
            current_ticket._id.toString()
        )
        .set({ authorization: "bad token" });
      expect(body.status).toBe(401);
      done();
    });
  });

  describe("PATCH - update ticket name", () => {
    it("Should update ticket name", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" +
            current_project._id.toString() +
            "/tickets/" +
            current_ticket._id.toString() +
            "/update/name/"
        )
        .set({ authorization: token })
        .send({ name: "renamedticket" });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.msg).toBe("Ticket name updated");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should fail to update ticket name with empty", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" +
            current_project._id.toString() +
            "/tickets/" +
            current_ticket._id.toString() +
            "/update/name/"
        )
        .set({ authorization: token })
        .send({ name: "" });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Ticket name can not be empty");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should fail to update ticket name without name", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" +
            current_project._id.toString() +
            "/tickets/" +
            current_ticket._id.toString() +
            "/update/name/"
        )
        .set({ authorization: token });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Ticket name can not be empty");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should fail update ticket name without token", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" +
            current_project._id.toString() +
            "/tickets/" +
            current_ticket._id.toString() +
            "/update/name/"
        )
        .send({ name: "renamedticket" });
      expect(body.status).toBe(401);
      done();
    });
    it("Should fail update ticket name with bad token", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" +
            current_project._id.toString() +
            "/tickets/" +
            current_ticket._id.toString() +
            "/update/name/"
        )
        .set({ authorization: "bad token" })
        .send({ name: "renamedticket" });
      expect(body.status).toBe(401);
      done();
    });
  });

  describe("PATCH - update ticket type", () => {
    it("Should update ticket type", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" +
            current_project._id.toString() +
            "/tickets/" +
            current_ticket._id.toString() +
            "/update/type/"
        )
        .set({ authorization: token })
        .send({ ttype: 1 });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.msg).toBe("Ticket type updated");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should fail to update ticket type with empty | string", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" +
            current_project._id.toString() +
            "/tickets/" +
            current_ticket._id.toString() +
            "/update/type/"
        )
        .set({ authorization: token })
        .send({ ttype: "" });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Ticket type can not be empty");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should fail to update ticket type without type", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" +
            current_project._id.toString() +
            "/tickets/" +
            current_ticket._id.toString() +
            "/update/type/"
        )
        .set({ authorization: token });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Ticket type can not be empty");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should fail to update ticket type with unsupported type", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" +
            current_project._id.toString() +
            "/tickets/" +
            current_ticket._id.toString() +
            "/update/type/"
        )
        .set({ authorization: token })
        .send({ ttype: 3 });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Ticket type must be a valid type");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should fail update ticket type without token", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" +
            current_project._id.toString() +
            "/tickets/" +
            current_ticket._id.toString() +
            "/update/type/"
        )
        .send({ ttype: TICKET_TYPE.BUG });
      expect(body.status).toBe(401);
      done();
    });
    it("Should fail update ticket type with bad token", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" +
            current_project._id.toString() +
            "/tickets/" +
            current_ticket._id.toString() +
            "/update/type/"
        )
        .set({ authorization: "bad token" })
        .send({ ttype: TICKET_TYPE.TODO });
      expect(body.status).toBe(401);
      done();
    });
  });

  describe("PATCH - update ticket content", () => {
    it("Should update ticket content", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" +
            current_project._id.toString() +
            "/tickets/" +
            current_ticket._id.toString() +
            "/update/content/"
        )
        .set({ authorization: token })
        .send({ content: "content..." });

      console.log(body.body.msg);
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.msg).toBe("Ticket content updated");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should fail update ticket content without token", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" +
            current_project._id.toString() +
            "/tickets/" +
            current_ticket._id.toString() +
            "/update/content/"
        )
        .send({ content: "content..." });
      expect(body.status).toBe(401);
      done();
    });
    it("Should fail update ticket content with bad token", async (done) => {
      const body = await request(m_app)
        .patch(
          "/api/projects/" +
            current_project._id.toString() +
            "/tickets/" +
            current_ticket._id.toString() +
            "/update/content/"
        )
        .set({ authorization: "bad token" })
        .send({ content: "content..." });
      expect(body.status).toBe(401);
      done();
    });
  });
});
