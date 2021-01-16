const request = require("supertest");
const { disconnect, connection } = require("mongoose");
const { verifyAccessToken } = require("../src/helpers/token");

const { m_app } = require("../src/app");

let server = null;
let token = null;

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
});

describe("USER ROUTE", () => {
  // logout
  describe("DELETE - Logout endpoint", () => {
    it("Should logout user", async (done) => {
      const body = await request(m_app)
        .delete("/api/user/logout")
        .set({ authorization: token });
      expect(body.status).toEqual(200);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.msg).toBe("Logged out");
      expect(body.body.data).toBeNull();
      done();
    });

    it("Should fail to logout user without authorization token", async (done) => {
      const body = await request(m_app).delete("/api/user/logout");
      expect(body.status).toEqual(401);
      done();
    });

    it("Should fail to logout user without valid authorization token", async (done) => {
      const body = await request(m_app)
        .delete("/api/user/logout")
        .set({ authorization: "not valid token" });
      expect(body.status).toEqual(401);
      done();
    });
  });

  // logout
  describe("GET - Get account information", () => {
    it("Should return object {name: 'Admin', lastname: 'Lastname', email: 'admin@admin.com'}", async (done) => {
      const body = await request(m_app)
        .get("/api/user/account")
        .set({ authorization: token });
      expect(body.status).toEqual(200);
      expect(body.body.desc).toBe("PASS");
      expect(body.body.msg).toBeNull();
      expect(typeof body.body.data).toBe("object");
      expect(body.body.data).toEqual({
        firstname: "Admin",
        lastname: "Lastname",
        email: "admin@admin.com",
      });
      done();
    });

    it("Should fail to return object without authorization token", async (done) => {
      const body = await request(m_app).delete("/api/user/account");
      expect(body.status).toEqual(401);
      done();
    });

    it("Should fail to return object without valid authorization token", async (done) => {
      const body = await request(m_app)
        .delete("/api/user/logout")
        .set({ authorization: "not valid token" });
      expect(body.status).toEqual(401);
      done();
    });
  });
});
