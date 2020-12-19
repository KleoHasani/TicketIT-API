const request = require("supertest");
const { m_app } = require("../src/app");
const { disconnect, connection } = require("mongoose");

let server = null;
let token = null;

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
