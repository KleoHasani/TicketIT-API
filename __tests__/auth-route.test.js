const request = require("supertest");
const { disconnect, connection } = require("mongoose");

const { m_app } = require("../src/app");

let server = null;
let token = null;
let refresh = null;

beforeAll((done) => {
  server = m_app.listen(3000);
  done();
});

afterAll(async (done) => {
  server.close(done);
  await connection.db.dropDatabase();
  await disconnect();
  server = null;
  token = null;
  refresh = null;
});

describe("AUTH ROUTE", () => {
  // register
  describe("POST - Register endpoint", () => {
    it("Should register new user", async (done) => {
      const body = await request(m_app).post("/api/auth/register").send({
        firstname: "Admin",
        lastname: "Lastname",
        email: "admin@admin.com",
        password: "admin123",
      });
      expect(body.status).toBe(201);
      expect(body.body.desc).toBe("PASS");
      done();
    });

    it("Should fail to register new user without (firstname)", async (done) => {
      const body = await request(m_app).post("/api/auth/register").send({
        firstname: "",
        lastname: "Lastname",
        email: "admin@admin.com",
        password: "admin123",
      });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("First name can not be empty");
      done();
    });

    it("Should fail to register new user without (firstname) as string", async (done) => {
      const body = await request(m_app).post("/api/auth/register").send({
        firstname: 123,
        lastname: "Lastname",
        email: "admin@admin.com",
        password: "admin123",
      });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("First name is not valid");
      done();
    });

    it("Should fail to register new user without (lastname)", async (done) => {
      const body = await request(m_app).post("/api/auth/register").send({
        firstname: "Admin",
        lastname: "",
        email: "admin@admin.com",
        password: "admin123",
      });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Last name can not be empty");
      done();
    });

    it("Should fail to register new user without (lastname) as string", async (done) => {
      const body = await request(m_app).post("/api/auth/register").send({
        firstname: "Admin",
        lastname: 123,
        email: "admin@admin.com",
        password: "admin123",
      });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Last name is not valid");
      done();
    });

    it("Should fail to register new user without (email)", async (done) => {
      const body = await request(m_app).post("/api/auth/register").send({
        firstname: "Admin",
        lastname: "Lastname",
        email: "",
        password: "admin123",
      });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Email can not be empty");
      done();
    });

    it("Should fail to register new user without (email) invalid", async (done) => {
      const body = await request(m_app).post("/api/auth/register").send({
        firstname: "Admin",
        lastname: "Lastname",
        email: "admin",
        password: "admin123",
      });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Not a valid email");
      done();
    });

    it("Should fail to register new user without (password)", async (done) => {
      const body = await request(m_app).post("/api/auth/register").send({
        firstname: "Admin",
        lastname: "Lastname",
        email: "admin@admin.com",
        password: "",
      });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Password can not be empty");
      done();
    });

    it("Should fail to register new user without (password) between 8 - 1024 chars length", async (done) => {
      const body = await request(m_app).post("/api/auth/register").send({
        firstname: "Admin",
        lastname: "Lastname",
        email: "admin@admin.com",
        password: "123",
      });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe(
        "Password must contain at least 8 or more characters"
      );
      done();
    });
  });

  // login
  describe("POST - Login endpoint", () => {
    it("Should login user", async (done) => {
      const body = await request(m_app).post("/api/auth/login").send({
        email: "admin@admin.com",
        password: "admin123",
      });
      expect(body.status).toEqual(200);
      expect(body.body.desc).toBe("PASS");
      token = body.headers["authorization"];
      refresh = body.headers["x-refresh"];
      expect(token).not.toBeNull();
      expect(token).toContain("Bearer");
      expect(refresh).not.toBeNull();
      done();
    });

    it("Should fail to login user without (email)", async (done) => {
      const body = await request(m_app).post("/api/auth/login").send({
        email: "",
        password: "admin123",
      });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Email can not be empty");
      done();
    });

    it("Should fail to login user if (email) is invalid", async (done) => {
      const body = await request(m_app).post("/api/auth/login").send({
        firstname: "Admin",
        lastname: "Lastname",
        email: "admin",
        password: "admin123",
      });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Not a valid email");
      done();
    });

    it("Should fail to login user without (password)", async (done) => {
      const body = await request(m_app).post("/api/auth/login").send({
        email: "admin@admin.com",
        password: "",
      });
      expect(body.status).toBe(200);
      expect(body.body.desc).toBe("FAIL");
      expect(body.body.msg).toBe("Password can not be empty");
      done();
    });
  });

  // refresh
  describe("GET - Refresh endpoint", () => {
    it("Should send a new refresh token", async (done) => {
      const body = await request(m_app).get("/api/auth/refresh-token").set({
        "x-refresh": refresh,
      });
      expect(body.status).toEqual(200);
      expect(body.body.desc).toBe("PASS");
      token = body.headers["authorization"];
      expect(token).not.toBeNull();
      expect(token).toContain("Bearer");
      done();
    });

    it("Should fail to send a new refresh token without x-refresh", async (done) => {
      const body = await request(m_app).get("/api/auth/refresh-token");
      expect(body.status).toEqual(400);
      done();
    });

    it("Should fail to send a new refresh token without matching x-refresh", async (done) => {
      const body = await request(m_app).get("/api/auth/refresh-token").set({
        "x-refresh": "not real token",
      });
      expect(body.status).toEqual(401);
      done();
    });
  });

  // logout
  describe("DELETE - Logout endpoint", () => {
    it("Should logout user", async (done) => {
      const body = await request(m_app)
        .delete("/api/auth/logout")
        .set({ authorization: token });
      expect(body.status).toEqual(200);
      expect(body.body.desc).toBe("PASS");
      done();
    });

    it("Should fail to logout user without authorization token", async (done) => {
      const body = await request(m_app).delete("/api/auth/logout");
      expect(body.status).toEqual(401);
      done();
    });

    it("Should fail to logout user without valid authorization token", async (done) => {
      const body = await request(m_app)
        .delete("/api/auth/logout")
        .set({ authorization: "not valid token" });
      expect(body.status).toEqual(401);
      done();
    });
  });
});
