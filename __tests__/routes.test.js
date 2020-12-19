const request = require("supertest");
const { disconnect, connection } = require("mongoose");

const { m_app } = require("../src/app");

let server = null;
let token = null;
let refresh = null;

beforeAll((done) => {
  server = m_app.listen(3000, () => {
    console.log("Testing server started");
    global.agent = request.agent(server);
    done();
  });
});

afterAll(async (done) => {
  server.close(done);
  await connection.db.dropDatabase();
  await disconnect();
  server = null;
  token = null;
  refresh = null;
});

describe("AUTH Route", () => {
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

  it("Should logout user", async (done) => {
    const body = await request(m_app)
      .delete("/api/auth/logout")
      .set({ authorization: token });
    expect(body.status).toEqual(200);
    expect(body.body.desc).toBe("PASS");
    done();
  });
});
